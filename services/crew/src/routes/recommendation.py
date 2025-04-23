from fastapi import APIRouter, HTTPException, Request
import logging
from datetime import datetime

from db.firestore_client import FirestoreClient
from ..crew import LmsCrew
from ..tools.roadmap_tool import sanitize_firebase_data
from crewai import Crew, Process, CrewOutput
import json

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
        # Log the incoming request data
        logger.info(f"Received request data: {data}")
        
        # Extract user ID and student profile data
        user_id = data.get('userId')
        logger.info(f"Extracted userId: {user_id}")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="userId is required")
        inputs = {
            'student_GPA': data.get('gpa'),
            'student_sat': data.get('sat'),
            'student_act': data.get('act'),
            'student_interests': data.get('interests', [])
        }
        
        # Initialize the LmsCrew to get access to the agents and tasks
        lms_crew = LmsCrew()

        # Run the crew
        recommend_crew = Crew(
            agents=[lms_crew.student_data_matcher(), lms_crew.college_admission_advisor()],
            tasks=[lms_crew.matching_task(), lms_crew.reporting_task()],
            process=Process.sequential,
            verbose=True
        )
        result = recommend_crew.kickoff(inputs=inputs)
        logger.info(f"Raw crew result: {result}")
        logger.info(f"Result type: {type(result)}")

        # Process the result
        recommendations = []
        if isinstance(result, CrewOutput):
            logger.info(f"CrewOutput detected. json_dict: {result.json_dict}, raw: {result.raw}")
            if result.json_dict:
                recommendations = result.json_dict
            elif result.raw:
                try:
                    recommendations = json.loads(result.raw)
                except json.JSONDecodeError:
                    logger.error(f"Failed to parse raw result as JSON")
                    recommendations = []
        elif isinstance(result, str):
            try:
                recommendations = json.loads(result)
            except json.JSONDecodeError:
                logger.error(f"Failed to parse string result as JSON")
                recommendations = []
        elif isinstance(result, list):
            recommendations = result
        else:
            logger.error(f"Unexpected result type: {type(result)}")
            recommendations = []

        # Validate the format of recommendations
        if not isinstance(recommendations, list):
            logger.error(f"Recommendations is not a list: {recommendations}")
            recommendations = []

        # Ensure each recommendation has the required fields
        validated_recommendations = []
        for rec in recommendations:
            if isinstance(rec, dict) and 'College_Name' in rec and 'Reason' in rec:
                validated_recommendations.append({
                    'College_Name': str(rec['College_Name']),
                    'Reason': str(rec['Reason'])
                })
            else:
                logger.warning(f"Skipping invalid recommendation: {rec}")

        # Prepare data for storage
        current_time = datetime.now().isoformat()
        recommendation_data = {'collegeRecommendations': {
            'recommendations_list': validated_recommendations,  # Store the array directly
            'generatedAt': current_time,
            'inputs': {
                'gpa': data.get('gpa'),
                'sat': data.get('sat'),
                'act': data.get('act'),
                'interests': data.get('interests', [])
            }
        }}

        # Save to Firestore
        logger.info(f"Saving recommendations to Firestore for user {user_id}")
        logger.info(f"Recommendation data to save: {recommendation_data}")
        try:
            await db_client.update_document('users', user_id, recommendation_data)
            logger.info("Successfully saved to Firestore")
        except Exception as e:
            logger.error(f"Failed to save to Firestore: {e}")
            raise
        
        return {
            "success": True,
            "recommendations": validated_recommendations  # Return the array directly
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))