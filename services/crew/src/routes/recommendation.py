from fastapi import APIRouter, HTTPException, Request
import logging

from db.firestore_client import FirestoreClient
from ..crew import LmsCrew

# Configure logging
logger = logging.getLogger(__name__)

# Initialize Firestore client
db_client = FirestoreClient()

# Create recommendations router
router = APIRouter(prefix="/api/crew")

@router.post("/recommendations")
async def get_college_recommendations(request: Request):
    """Get personalized college recommendations for a student."""
    data = await request.json()
    try:
        # Extract student profile data
        inputs = {
            'student_GPA': data.get('gpa'),
            'student_sat': data.get('sat'),
            'student_act': data.get('act'),
            'student_interests': data.get('interests', [])
        }
        
        # Run the crew
        crew = LmsCrew()
        result = crew.crew().kickoff(inputs=inputs)
        
        return {
            "success": True,
            "recommendations": result
        }
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))