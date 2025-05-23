from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type, Optional, List, Dict, Any
import sys
from datetime import datetime, timedelta
import json
import uuid
import logging
import traceback
from google.cloud.firestore import DocumentSnapshot
from google.protobuf.timestamp_pb2 import Timestamp

# Add the project root to the Python path to import shared modules
from db.firestore_client import FirestoreClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firestore client
db_client = FirestoreClient()

def sanitize_firebase_data(data):
    """
    Recursively convert Firebase objects to Python native types.
    Handles DatetimeWithNanoseconds by converting to ISO format strings.
    """
    if data is None:
        return None

    if isinstance(data, datetime):
        return data.isoformat()

    if isinstance(data, dict):
        return {k: sanitize_firebase_data(v) for k, v in data.items()}

    if isinstance(data, list):
        return [sanitize_firebase_data(item) for item in data]

    return data

class RoadmapInput(BaseModel):
    user_id: str = Field(..., description="User ID to generate roadmap for")
    target_schools: List[str] = Field(..., description="List of target school names")
    school_info: Optional[List[Dict[str, Any]]] = Field(None, description="Optional school information data")
    student_profile: Optional[Dict[str, Any]] = Field(None, description="Optional student profile data")

class FirestoreRoadmapTool(BaseTool):
    name: str = "FirestoreRoadmapTool"
    description: str = "Fetches student data and saves generated roadmap to Firestore"
    args_schema: Type[BaseModel] = RoadmapInput

    def _run(self, user_id: str, target_schools: List[str], school_info: Optional[List[Dict[str, Any]]] = None, student_profile: Optional[Dict[str, Any]] = None) -> str:
        """
        Fetch student data and save generated roadmap to Firestore.
        This tool does not generate the roadmap content itself - that's handled by the agent.
        """
        try:
            if not student_profile:
                logger.info(f"No student profile provided, fetching from Firestore")
                try:
                    user_data = db_client.get_user_profile_sync(user_id)
                    
                    if not user_data:
                        return f"Error: User {user_id} not found"
                    student_profile = user_data.get('studentProfile')
                    if not student_profile:
                        return "Error: Student profile is empty"
                except Exception as e:
                    logger.error(f"Error fetching user profile: {e}")
                    return f"Error fetching user profile: {str(e)}"

            student_profile = sanitize_firebase_data(student_profile)

            if not school_info:
                logger.info(f"No school info provided, fetching from Firestore")
                try:
                    school_docs = db_client.get_all_documents_sync('US-Colleges')
                except Exception as e:
                    logger.error(f"Error fetching schools: {e}")
                    return f"Error fetching schools: {str(e)}"
            else:
                school_docs = school_info

            school_docs = sanitize_firebase_data(school_docs)
            
            # Return the prepared data for the agent to use
            prepared_data = {
                "user_id": user_id,
                "target_schools": target_schools,
                "student_profile": student_profile,
                "school_info": [s for s in school_docs if s.get("University Name") in target_schools]
            }
            
            return f"Data prepared successfully for roadmap generation: {json.dumps(prepared_data, default=str)}"

        except Exception as e:
            logger.error(f"Error preparing data: {str(e)}")
            logger.error(traceback.format_exc())
            return f"Error preparing data: {str(e)}"
            
    def save_roadmap_to_firestore(self, user_id: str, roadmap_data: Dict[str, Any]) -> str:
        """
        Save the generated roadmap to Firestore.
        This method should be called after the roadmap has been generated by the agent.
        """
        try:
            # Handle CrewOutput objects (from newer versions of crewAI)
            if hasattr(roadmap_data, 'raw') and hasattr(roadmap_data, 'output'):
                logger.info("Converting CrewOutput object to dictionary")
                # Extract the output from the CrewOutput object
                raw_output = roadmap_data.output
                
                # If the output is a string, try to parse it as JSON
                if isinstance(raw_output, str):
                    import re
                    # Check if the output is wrapped in markdown code blocks
                    json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', raw_output)
                    if json_match:
                        raw_output = json_match.group(1).strip()
                    
                    # Try to parse the output as JSON
                    try:
                        roadmap_data = json.loads(raw_output)
                    except json.JSONDecodeError:
                        return f"Error: Failed to parse roadmap result as JSON: {raw_output}"
                else:
                    # Output is already a dict
                    roadmap_data = raw_output
            
            # Validate the roadmap data
            if not isinstance(roadmap_data, dict):
                return f"Error: Invalid roadmap data format. Expected dict, got {type(roadmap_data)}"
                
            if "tasks" not in roadmap_data or "recommendations" not in roadmap_data:
                return f"Error: Invalid roadmap data. Missing required fields: {roadmap_data.keys()}"
                
            # Add timestamps to tasks
            current_time = datetime.now().isoformat()
            tasks_with_timestamps = []
            
            for task in roadmap_data.get("tasks", []):
                # Ensure each task has an ID
                if "id" not in task:
                    task["id"] = str(uuid.uuid4())
                    
                # Add timestamps and default completion status
                task_with_timestamps = {
                    **task,
                    "createdAt": current_time,
                    "updatedAt": current_time,
                    "isCompleted": False
                }
                tasks_with_timestamps.append(task_with_timestamps)
                
            # Process recommendations to ensure they have the right format
            recommendations = []
            for rec in roadmap_data.get("recommendations", []):
                if isinstance(rec, str):
                    # Convert string recommendations to objects with priority
                    recommendations.append({
                        "text": rec,
                        "priority": "medium",  # Default priority
                        "createdAt": current_time
                    })
                elif isinstance(rec, dict):
                    # Check if the recommendation has the expected format
                    if "text" in rec and "priority" in rec:
                        # Already in the right format, just add timestamp
                        recommendations.append({
                            "text": rec["text"],
                            "priority": rec["priority"],
                            "createdAt": current_time
                        })
                    else:
                        # Try to adapt to whatever format we received
                        text = rec.get("text", "")
                        if not text and len(rec) > 0:
                            # If no "text" field but has other fields, use the first string value
                            for key, value in rec.items():
                                if isinstance(value, str) and len(value) > 0:
                                    text = value
                                    break
                        
                        recommendations.append({
                            "text": text or "Recommendation",
                            "priority": rec.get("priority", "medium"),
                            "createdAt": current_time
                        })
                    
            # Prepare the final data for Firestore
            processed_data = {
                "tasks": tasks_with_timestamps,
                "totalTasks": len(tasks_with_timestamps),
                "recommendations": recommendations,
                "lastTaskGeneratedAt": current_time,
                "updatedAt": current_time
            }
            
            # Log the data we're sending to Firestore
            logger.info(f"Updating user profile with processed data: {json.dumps(processed_data, default=str)}")
            
            # Update Firestore
            db_client.update_document_sync('users', user_id, processed_data)
            return f"Successfully saved roadmap with {len(tasks_with_timestamps)} tasks for user {user_id}"
            
        except Exception as e:
            logger.error(f"Error saving roadmap to Firestore: {e}")
            logger.error(traceback.format_exc())
            return f"Error saving roadmap to Firestore: {str(e)}"
