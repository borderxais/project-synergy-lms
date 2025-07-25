from fastapi import APIRouter, HTTPException, Request, Depends
from typing import Dict, Any, List, Optional
import logging
import sys
import os
import httpx
from datetime import datetime
import json
from pathlib import Path
from ..config import CREW_SERVICE_URL, LLM_SERVICE_URL

# Add project root to Python path - fix for Docker container structure
# In Docker, the directory structure is different, so we need a more robust approach
try:
    # First try the original approach (for local development)
    project_root = Path(__file__).resolve().parents[4]  # Go up 4 levels to reach project root
    sys.path.append(str(project_root))
except IndexError:
    # If that fails, we're likely in the Docker container
    # The app directory is mounted at /app in the container
    project_root = Path("/app")
    sys.path.append(str(project_root))
    # Also add the services directory which is mounted at /app/services
    sys.path.append("/app/services")

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
                "academicInterests": onboarding_data.get("academicInterests", []),
                "onboardingCompleted": True,
                "lastUpdated": firestore.SERVER_TIMESTAMP
            },
            "isOnboarded": True,
            "onboardedAt": firestore.SERVER_TIMESTAMP,
            "lastTaskGeneratedAt": firestore.SERVER_TIMESTAMP,
            "totalTasks": 0,
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        
        
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
                    async with httpx.AsyncClient(timeout=300.0) as client:
                        roadmap_payload = {
                            "userId": user_id,
                            "targetSchools": target_schools,
                            "schoolInfo": college_data
                        }
                        roadmap_url = f"{CREW_SERVICE_URL}/api/crew/roadmap"
                        logger.info(f"Calling crew service at {roadmap_url}")
                        response = await client.post(
                            roadmap_url,
                            json=roadmap_payload,
                        )
                        
                        if response.status_code == 200:
                            logger.info("Roadmap generated and saved successfully")
                            
                except Exception as e:
                    logger.error(f"Error generating roadmap: {e}")
                    # Continue without tasks if roadmap generation fails
        
        # Return success response
        return {
            "success": True,
            "message": "Onboarding completed successfully",
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
            async with httpx.AsyncClient(timeout=300.0) as client:
                for school in school_data:
                    analysis_url = f"{LLM_SERVICE_URL}/analyze-schools"
                    logger.info(f"Calling LLM service at {analysis_url}")
                    analysis_response = await client.post(
                        analysis_url,
                        json=school,
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