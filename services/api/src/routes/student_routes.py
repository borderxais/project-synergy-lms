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

@router.get("/api/student/{student_id}")
async def get_student_profile(student_id: str, token: Dict = Depends(verify_token)):
    """Get student profile information."""
    try:
        # Get student profile from Firestore
        student = await db_client.get_student(student_id)
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Get target schools for the student
        target_schools = await db_client.get_student_target_schools(student_id)
        
        # Get student interests
        interests = await db_client.get_student_interests(student_id)
        
        # Combine all data
        response = {
            **student,
            "targetSchools": target_schools,
            "interests": interests
        }
        
        return response
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving student profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/student/{student_id}")
async def update_student_profile(student_id: str, request: Request, token: Dict = Depends(verify_token)):
    """Update student profile information."""
    try:
        data = await request.json()
        
        # Update student profile in Firestore
        await db_client.update_student_profile(student_id, data)
        
        return {"message": "Profile updated successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error updating student profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/student/{student_id}/interests")
async def add_student_interest(student_id: str, request: Request, token: Dict = Depends(verify_token)):
    """Add or update student interest."""
    try:
        interest_data = await request.json()
        
        # Validate interest data
        if not interest_data.get("category") or not interest_data.get("interest"):
            raise HTTPException(status_code=400, detail="Category and interest are required")
        
        # Add or update interest in Firestore
        interest_id = await db_client.add_or_update_student_interest(
            student_id, 
            interest_data
        )
        
        return {
            "id": interest_id,
            "message": "Interest added/updated successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error adding/updating student interest: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/student/{student_id}/interests/{interest_id}")
async def remove_student_interest(student_id: str, interest_id: str, token: Dict = Depends(verify_token)):
    """Remove student interest."""
    try:
        # Remove interest from Firestore
        success = await db_client.remove_student_interest(student_id, interest_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Interest not found")
        
        return {"message": "Interest removed successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error removing student interest: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/students")
async def get_all_students(token: Dict = Depends(verify_token)):
    """Get all students (for admin purposes)."""
    try:
        # Check if user has admin role
        user_id = token.get("uid")
        user = await db_client.get_user_profile(user_id)
        
        if not user or user.get("role") != "Admin":
            raise HTTPException(status_code=403, detail="Unauthorized access")
        
        # Get all students from Firestore
        students = await db_client.get_all_students()
        
        return students
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving all students: {e}")
        raise HTTPException(status_code=500, detail=str(e))