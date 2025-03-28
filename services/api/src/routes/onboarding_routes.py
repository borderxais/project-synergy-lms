from fastapi import APIRouter, HTTPException, Request, Depends
from typing import Dict, Any, List, Optional
import logging
import sys
import os
import httpx
from datetime import datetime
import json
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).resolve().parents[4]  # Go up 4 levels to reach project root
sys.path.append(str(project_root))

from db.firestore_client import FirestoreClient
from firebase_admin import auth, firestore

# Configure logging
logger = logging.getLogger(__name__)
router = APIRouter()
db_client = FirestoreClient()

# Custom JSON encoder to handle Firestore SERVER_TIMESTAMP
class FirestoreEncoder(json.JSONEncoder):
    def default(self, obj):
        # Check if it's a Firestore Sentinel object
        if hasattr(obj, '_sentinel_type'):
            return f"Sentinel: {obj._sentinel_type}"
        # Check if it's a datetime object
        if hasattr(obj, 'isoformat'):
            return obj.isoformat()
        # Let the base class handle anything else
        try:
            return super().default(obj)
        except TypeError:
            return str(obj)  # Convert any non-serializable objects to strings

# Helper function to verify authentication token
async def verify_token(request: Request):
    authorization = request.headers.get("Authorization")
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization token")
    
    token = authorization.split("Bearer ")[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error(f"Error verifying token: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

# Helper to remove undefined and null values from an object recursively
def clean_object(obj):
    if isinstance(obj, dict):
        return {k: clean_object(v) for k, v in obj.items() if v is not None}
    elif isinstance(obj, list):
        return [clean_object(item) for item in obj if item is not None]
    else:
        return obj

@router.post("/api/onboarding")
async def submit_onboarding(request: Request, token: Dict = Depends(verify_token)):
    """Submit onboarding data."""
    try:
        onboarding_data = await request.json()
        user_id = token.get("uid")
        
        logger.info(f"Received onboarding data for user: {user_id}")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        
        # Get user document from Firestore
        user = await db_client.get_user_profile(user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prepare onboarding data
        cleaned_data = clean_object({
            "studentProfile": {
                "collegePreferences": {
                    "schoolCategories": onboarding_data.get("collegePreferences", {}).get("schoolCategories", []),
                    "targetSchools": onboarding_data.get("collegePreferences", {}).get("targetSchools", []),
                    "earlyDecision": onboarding_data.get("collegePreferences", {}).get("earlyDecision", "none")
                },
                "generalInfo": onboarding_data.get("generalInfo", {}),
                "highSchoolProfile": onboarding_data.get("highSchoolProfile", {}),
                "interests": onboarding_data.get("interests", []),
                "onboardingCompleted": True,
                "lastUpdated": firestore.SERVER_TIMESTAMP
            },
            "isOnboarded": True,
            "onboardedAt": firestore.SERVER_TIMESTAMP,
            "lastTaskGeneratedAt": firestore.SERVER_TIMESTAMP,
            "totalTasks": 0,
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        
        # Log the cleaned data before saving
        logger.info(f"Cleaned onboarding data structure: {json.dumps(cleaned_data, cls=FirestoreEncoder)}")
        logger.info(f"Original onboarding data: {json.dumps(onboarding_data, default=str)}")
        
        # Update user profile with onboarding data
        await db_client.update_user_profile(user_id, cleaned_data)
        
        # Get target schools for roadmap generation
        target_schools = onboarding_data.get("collegePreferences", {}).get("targetSchools", [])
        
        # Generate tasks if target schools are provided
        tasks = []
        if target_schools and len(target_schools) > 0:
            # Get college info from Firestore
            college_data = []
            for school_name in target_schools:
                college = await db_client.get_college_by_name(school_name)
                if college:
                    college_data.append(college)
                else:
                    logger.warning(f"College not found: {school_name}")
            
            if college_data:
                # Call LLM service to generate roadmap
                try:
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        roadmap_response = await client.post(
                            "http://localhost:3003/generate-roadmap-from-db",
                            json={
                                "userId": user_id,
                                "targetSchool": target_schools,
                                "schoolInfo": college_data
                            },
                            headers={"Content-Type": "application/json"}
                        )
                        
                        if roadmap_response.status_code == 200:
                            roadmap_data = roadmap_response.json()
                            tasks = roadmap_data.get("data", {}).get("tasks", [])
                            
                            # Format tasks with proper timestamps
                            formatted_tasks = []
                            for task in tasks:
                                due_date = task.get("dueDate")
                                due_date_timestamp = None
                                
                                if due_date:
                                    try:
                                        due_date_dt = datetime.fromisoformat(due_date.replace("Z", "+00:00"))
                                        due_date_timestamp = firestore.Timestamp.from_datetime(due_date_dt)
                                    except:
                                        # Default to 3 months from now
                                        due_date_timestamp = None
                                
                                formatted_tasks.append({
                                    "category": task.get("category", "general"),
                                    "createdAt": firestore.SERVER_TIMESTAMP,
                                    "dueDate": due_date_timestamp,
                                    "isCompleted": False,
                                    "priority": task.get("priority", "medium"),
                                    "title": task.get("title"),
                                    "description": task.get("description"),
                                    "school": task.get("school", "All Schools"),
                                    "updatedAt": firestore.SERVER_TIMESTAMP
                                })
                            
                            # Update user document with tasks
                            await db_client.update_user_profile(user_id, {
                                "tasks": formatted_tasks,
                                "totalTasks": len(formatted_tasks),
                                "lastTaskGeneratedAt": firestore.SERVER_TIMESTAMP,
                                "updatedAt": firestore.SERVER_TIMESTAMP
                            })
                            
                            tasks = formatted_tasks
                except Exception as e:
                    logger.error(f"Error generating roadmap: {e}")
                    # Continue without tasks if roadmap generation fails
        
        # Return success response
        return {
            "success": True,
            "message": "Onboarding completed successfully",
            "tasks": tasks
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error in onboarding: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/analyze-schools")
async def analyze_schools(request: Request, token: Dict = Depends(verify_token)):
    """Analyze schools using LLM."""
    try:
        data = await request.json()
        schools = data.get("schools", [])
        
        if not schools or len(schools) == 0:
            raise HTTPException(status_code=400, detail="Schools list is required")
        
        # Get school data from Firestore
        school_data = []
        for school_name in schools:
            school = await db_client.get_college_by_name(school_name)
            if school:
                school_data.append(school)
        
        if not school_data:
            raise HTTPException(status_code=404, detail="No valid schools found")
        
        # Call LLM service to analyze schools
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                analysis_response = await client.post(
                    "http://localhost:3001/analyze-schools",
                    json={"schools": school_data},
                    headers={"Content-Type": "application/json"}
                )
                
                if analysis_response.status_code == 200:
                    analysis_data = analysis_response.json()
                    return analysis_data
                else:
                    raise HTTPException(
                        status_code=analysis_response.status_code,
                        detail=f"Error from LLM service: {analysis_response.text}"
                    )
        except httpx.RequestError as e:
            logger.error(f"Error calling LLM service: {e}")
            raise HTTPException(status_code=503, detail="LLM service unavailable")
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error analyzing schools: {e}")
        raise HTTPException(status_code=500, detail=str(e))