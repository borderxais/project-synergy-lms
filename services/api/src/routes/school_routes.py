from fastapi import APIRouter, HTTPException, Request, Depends
from typing import Dict, Any, List, Optional
import logging
from db.firestore_client import FirestoreClient

# Initialize Firestore client
db_client = FirestoreClient()

from firebase_admin import auth

# Configure logging
logger = logging.getLogger(__name__)
router = APIRouter()

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

@router.get("/api/schools")
async def get_all_schools(token: Dict = Depends(verify_token)):
    """Get all schools."""
    try:
        # Get all schools from Firestore
        schools = await db_client.get_all_schools()
        return schools
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving schools: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/schools/{school_id}")
async def get_school_by_id(school_id: str, token: Dict = Depends(verify_token)):
    """Get school by ID with programs and activities."""
    try:
        # Get school from Firestore
        school = await db_client.get_school(school_id)
        
        if not school:
            raise HTTPException(status_code=404, detail="School not found")
        
        # Get programs for the school
        programs = await db_client.get_school_programs(school_id)
        
        # Get activities for the school
        activities = await db_client.get_school_activities(school_id)
        
        # Get test requirements for the school
        test_requirements = await db_client.get_school_test_requirements(school_id)
        
        # Combine all data
        response = {
            **school,
            "programs": programs,
            "activities": activities,
            "testRequirements": test_requirements
        }
        
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving school details: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/schools/target")
async def add_target_school(request: Request, token: Dict = Depends(verify_token)):
    """Add target school for student."""
    try:
        data = await request.json()
        
        # Validate required fields
        required_fields = ["studentId", "schoolId"]
        for field in required_fields:
            if field not in data:
                raise HTTPException(status_code=400, detail=f"{field} is required")
        
        # Add target school in Firestore
        target_school_id = await db_client.add_target_school(
            data["studentId"],
            data["schoolId"],
            {
                "targetEntryYear": data.get("targetEntryYear"),
                "targetGrade": data.get("targetGrade"),
                "priorityLevel": data.get("priorityLevel", "medium"),
                "financialAidNeeded": data.get("financialAidNeeded", False),
                "scholarshipNeeded": data.get("scholarshipNeeded", False),
                "notes": data.get("notes", "")
            }
        )
        
        return {
            "id": target_school_id,
            "message": "Target school added successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error adding target school: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/schools/student/{student_id}/targets")
async def get_student_target_schools(student_id: str, token: Dict = Depends(verify_token)):
    """Get student's target schools."""
    try:
        # Get target schools from Firestore
        target_schools = await db_client.get_student_target_schools(student_id)
        return target_schools
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving target schools: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/schools/target/{target_id}")
async def update_target_school(target_id: str, request: Request, token: Dict = Depends(verify_token)):
    """Update target school status."""
    try:
        data = await request.json()
        
        # Update target school in Firestore
        success = await db_client.update_target_school(target_id, data)
        
        if not success:
            raise HTTPException(status_code=404, detail="Target school not found")
        
        return {"message": "Target school updated successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error updating target school: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/schools/target/{target_id}")
async def remove_target_school(target_id: str, token: Dict = Depends(verify_token)):
    """Remove target school."""
    try:
        # Remove target school from Firestore
        success = await db_client.remove_target_school(target_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Target school not found")
        
        return {"message": "Target school removed successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error removing target school: {e}")
        raise HTTPException(status_code=500, detail=str(e))