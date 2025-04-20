from fastapi import APIRouter, HTTPException, Request
import logging
from typing import Dict

from db.firestore_client import FirestoreClient
from ..crew import LmsCrew
from ..tools.roadmap_tool import sanitize_firebase_data
from crewai import Crew, Process

# Configure logging
logger = logging.getLogger(__name__)

# Initialize Firestore client
db_client = FirestoreClient()

# Create roadmap router
router = APIRouter(prefix="/api/crew")

async def get_user_profile(user_id: str):
    """Get user profile from Firestore."""
    try:
        user_profile = await db_client.get_user_profile(user_id)
        if not user_profile or not user_profile.get('studentProfile'):
            raise HTTPException(status_code=404, detail=f"User profile {user_id} not found or incomplete")
        return user_profile
    except Exception as e:
        logger.error(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roadmap")
async def generate_roadmap(request: Request):
    """Generate a personalized roadmap for a student."""
    data = await request.json()
    try:
        # Extract required data
        user_id = data.get('userId')
        target_schools = data.get('targetSchools', [])
        school_info = data.get('schoolInfo', [])
        
        if not user_id or not target_schools:
            raise HTTPException(status_code=400, detail="Missing userId or targetSchools")
            
        logger.info(f"Generating roadmap for user {user_id} targeting {target_schools}")
        
        # Get school data from Firestore if not provided
        if not school_info:
            logger.info(f"We did not get school info from the client, so we're fetching it from Firestore")
            try:
                school_info = await db_client.get_all_documents('US-Colleges')
                if not school_info:
                    raise HTTPException(status_code=404, detail=f"Schools not found")
            except Exception as e:
                logger.error(f"Error fetching schools: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        # Get user profile from Firestore
        user_profile = await get_user_profile(user_id)
        if not user_profile:
            raise HTTPException(status_code=404, detail=f"User profile {user_id} not found")
            
        # Get student profile
        student_profile = user_profile.get('studentProfile')
        if not student_profile:
            raise HTTPException(status_code=400, detail="Student profile is empty")
            
        logger.info(f"Got student profile and school info, generating roadmap")
        
        # Sanitize all Firebase data before passing to CrewAI
        sanitized_student_profile = sanitize_firebase_data(student_profile)
        sanitized_school_info = sanitize_firebase_data(school_info)
        
        # Create inputs for the roadmap task with sanitized data
        inputs = {
            'user_id': user_id,
            'target_schools': target_schools,
            'school_info': sanitized_school_info,
            'student_profile': sanitized_student_profile
        }
        
        # Initialize the LmsCrew to get access to the agents and tasks
        lms_crew = LmsCrew()
        
        # Create a new crew with only the roadmap generator agent and roadmap task
        roadmap_crew = Crew(
            agents=[lms_crew.roadmap_generator()],
            tasks=[lms_crew.roadmap_task()],
            process=Process.sequential,
            verbose=True
        )
        
        # Run only the roadmap task
        result = roadmap_crew.kickoff(inputs=inputs)
        
        return {
            "success": True,
            "message": result
        }
    except Exception as e:
        logger.error(f"Error generating roadmap: {e}")
        raise HTTPException(status_code=500, detail=str(e))