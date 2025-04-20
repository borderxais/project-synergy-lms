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
    description: str = "Generates a personalized college application roadmap based on student profile and target schools"
    args_schema: Type[BaseModel] = RoadmapInput

    def _run(self, user_id: str, target_schools: List[str], school_info: Optional[List[Dict[str, Any]]] = None, student_profile: Optional[Dict[str, Any]] = None) -> str:
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

            roadmap = self._generate_roadmap(student_profile, school_docs, target_schools)

            # Use ISO-formatted datetime strings instead of SERVER_TIMESTAMP placeholders
            current_time = datetime.now().isoformat()
            tasks_with_timestamps = [
                {
                    **task,
                    "createdAt": current_time,
                    "updatedAt": current_time,
                    "isCompleted": False
                } for task in roadmap.get('tasks', [])
            ]

            try:
                # Use ISO-formatted datetime strings like the LLM service does
                processed_data = {
                    "tasks": tasks_with_timestamps,
                    "totalTasks": len(roadmap.get('tasks', [])),
                    "recommendations": roadmap.get('recommendations', []),
                    "lastTaskGeneratedAt": current_time,
                    "updatedAt": current_time
                }
                
                # Log the data we're sending to Firestore
                logger.info(f"Updating user profile with processed data: {json.dumps(processed_data, default=str)}")
                
                # Use the regular update_document method instead of update_user_profile_sync
                db_client.update_document_sync('users', user_id, processed_data)
                return f"Successfully generated roadmap with {len(roadmap.get('tasks', []))} tasks for user {user_id}. Roadmap details: {json.dumps(roadmap, default=str)}"
            except Exception as e:
                logger.error(f"Error updating user profile: {e}")
                return f"Generated roadmap but failed to save to database: {str(e)}. Roadmap details: {json.dumps(roadmap, default=str)}"

        except Exception as e:
            logger.error(f"Error generating roadmap: {str(e)}")
            logger.error(traceback.format_exc())
            return f"Error generating roadmap: {str(e)}"

    def _generate_roadmap(self, profile: Dict[str, Any], schools: List[Dict[str, Any]], target_schools: List[str]) -> Dict[str, Any]:
        try:
            grade = profile.get('generalInfo', {}).get('grade', "")
            gpa = profile.get('highSchoolProfile', {}).get('gpa', "")
            weighted_gpa = profile.get('highSchoolProfile', {}).get('weightedGpa', "")
            interests = profile.get('interests', [])
            planned_tests = profile.get('highSchoolProfile', {}).get('plannedTests', [])
            study_style = profile.get('highSchoolProfile', {}).get('studyStylePreference', [])

            time_remaining_info = []
            for school in target_schools:
                school_info = next((s for s in schools if s.get("University Name") == school), None)
                if school_info:
                    deadline = school_info.get('Regular Decision Deadline', "Unknown")
                    time_remaining_info.append(f"{school}: {deadline}")

            tasks = []
            
            tasks.append({
                "id": str(uuid.uuid4()),
                "title": "Update your resume",
                "description": "Create or update your resume with recent activities, achievements, and work experience",
                "dueDate": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
                "category": "Application",
                "priority": "medium",
                "school": "All Schools",
                "isCompleted": False
            })
            
            tasks.append({
                "id": str(uuid.uuid4()),
                "title": "Request letters of recommendation",
                "description": "Contact teachers and mentors for letters of recommendation. Provide them with your resume and information about your target schools.",
                "dueDate": (datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d"),
                "category": "Application",
                "priority": "high",
                "school": "All Schools",
                "isCompleted": False
            })
            
            if planned_tests:
                for test in planned_tests:
                    test_name = test.upper() if test.lower() in ['sat', 'act'] else test
                    tasks.append({
                        "id": str(uuid.uuid4()),
                        "title": f"Prepare for {test_name}",
                        "description": f"Study for the {test_name} and take practice tests to ensure a high score. Consider enrolling in a prep course or finding a tutor if needed.",
                        "dueDate": (datetime.now() + timedelta(days=60)).strftime("%Y-%m-%d"),
                        "category": "Test Prep",
                        "priority": "high",
                        "school": "All Schools",
                        "isCompleted": False
                    })
            else:
                tasks.append({
                    "id": str(uuid.uuid4()),
                    "title": "Plan for standardized tests",
                    "description": "Research which standardized tests (SAT, ACT, Subject Tests) are required by your target schools and register for them.",
                    "dueDate": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
                    "category": "Test Prep",
                    "priority": "high",
                    "school": "All Schools",
                    "isCompleted": False
                })
            
            for school in target_schools:
                school_info = next((s for s in schools if s.get("University Name") == school), None)
                deadline = "2025-12-01"  # Default deadline if not found
                
                if school_info:
                    deadline = school_info.get('Regular Decision Deadline', "2025-12-01")
                    if isinstance(deadline, str) and deadline.strip():
                        try:
                            deadline_date = datetime.strptime(deadline, "%Y-%m-%d")
                        except ValueError:
                            deadline_date = datetime.now() + timedelta(days=90)
                    else:
                        deadline_date = datetime.now() + timedelta(days=90)
                else:
                    deadline_date = datetime.now() + timedelta(days=90)
                
                tasks.append({
                    "id": str(uuid.uuid4()),
                    "title": f"Submit application to {school}",
                    "description": f"Complete and submit your application to {school} before the regular decision deadline",
                    "dueDate": (deadline_date - timedelta(days=7)).strftime("%Y-%m-%d"),
                    "category": "Application",
                    "priority": "high",
                    "school": school,
                    "isCompleted": False
                })
                
                tasks.append({
                    "id": str(uuid.uuid4()),
                    "title": f"Write essay for {school}",
                    "description": f"Write the required application essays for {school}. Research the school's values and tailor your essay to demonstrate why you're a good fit.",
                    "dueDate": (deadline_date - timedelta(days=30)).strftime("%Y-%m-%d"),
                    "category": "Essay",
                    "priority": "high",
                    "school": school,
                    "isCompleted": False
                })
                
                tasks.append({
                    "id": str(uuid.uuid4()),
                    "title": f"Complete FAFSA for {school}",
                    "description": f"Fill out the Free Application for Federal Student Aid (FAFSA) and submit it to {school}",
                    "dueDate": (deadline_date - timedelta(days=14)).strftime("%Y-%m-%d"),
                    "category": "Financial Aid",
                    "priority": "high",
                    "school": school,
                    "isCompleted": False
                })
                
                tasks.append({
                    "id": str(uuid.uuid4()),
                    "title": f"Research programs at {school}",
                    "description": f"Research specific programs, majors, and opportunities at {school} that align with your interests in {', '.join(interests) if interests else 'your field'}",
                    "dueDate": (datetime.now() + timedelta(days=45)).strftime("%Y-%m-%d"),
                    "category": "Research",
                    "priority": "medium",
                    "school": school,
                    "isCompleted": False
                })

            tasks.sort(key=lambda x: x["dueDate"])

            recommendations = [
                "Start your application process early to avoid last-minute stress",
                f"Focus on maintaining or improving your {gpa if gpa else ''} GPA while preparing for standardized tests",
                f"Develop extracurricular activities that align with your interests in {', '.join(interests) if interests else 'your chosen field'} and target schools' values"
            ]
            
            if any(test.lower() == 'sat' for test in planned_tests):
                recommendations.append("For SAT preparation, focus on consistent practice with official College Board materials and take at least 3 full practice tests before your exam date")
            
            if any(test.lower() == 'act' for test in planned_tests):
                recommendations.append("For ACT preparation, pay special attention to the science section and time management, as the ACT is more time-pressured than the SAT")
            
            if study_style:
                study_style_str = ', '.join(study_style)
                if 'visual' in study_style_str.lower():
                    recommendations.append("Leverage your visual learning style by using diagrams, charts, and color-coding in your study materials")
                elif 'auditory' in study_style_str.lower():
                    recommendations.append("Enhance your auditory learning style by recording lectures, participating in study groups, and explaining concepts out loud")
                elif 'kinesthetic' in study_style_str.lower():
                    recommendations.append("Utilize your kinesthetic learning style by incorporating movement into your study routine and using hands-on activities when possible")

            return {
                "tasks": tasks,
                "recommendations": recommendations
            }

        except Exception as e:
            logger.error(f"Error in _generate_roadmap: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                "tasks": [],
                "recommendations": [f"Error generating roadmap: {str(e)}"]
            }
