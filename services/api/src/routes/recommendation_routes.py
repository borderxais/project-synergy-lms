from fastapi import APIRouter, HTTPException, Request, Depends
from typing import Dict, Any, List, Optional
import logging
import sys
import os
import httpx
from datetime import datetime
import json
from pathlib import Path
from ..config import CREW_SERVICE_URL

# Add project root to Python path - fix for Docker container structure
try:
    # First try the original approach (for local development)
    project_root = Path(__file__).resolve().parents[4]  # Go up 4 levels to reach project root
    sys.path.append(str(project_root))
except IndexError:
    # If that fails, we're likely in the Docker container
    project_root = Path("/app")
    sys.path.append(str(project_root))
    sys.path.append("/app/services")

from db.firestore_client import FirestoreClient
from firebase_admin import auth, firestore
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

# Configure logging
logger = logging.getLogger(__name__)
router = APIRouter()
db_client = FirestoreClient()

# Custom JSON encoder to handle Firestore SERVER_TIMESTAMP
class FirestoreEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '_sentinel_type'):
            return f"Sentinel: {obj._sentinel_type}"
        if hasattr(obj, 'isoformat'):
            return obj.isoformat()
        try:
            return super().default(obj)
        except TypeError:
            return str(obj)

# Helper to remove undefined and null values from an object recursively
def clean_object(obj):
    if isinstance(obj, dict):
        return {k: clean_object(v) for k, v in obj.items() if v is not None}
    elif isinstance(obj, list):
        return [clean_object(item) for item in obj if item is not None]
    else:
        return obj

@router.post("/api/recommendations")
async def get_crew_recommendations(request: Request, token: Dict = Depends(verify_token)):
    """Get crew recommendations based on user profile and preferences."""
    try:
        user_id = token.get("uid")
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")

        # Get user profile from Firestore
        user = await db_client.get_user_profile(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get data from request body
        data = await request.json()
        
        # Call crew service for recommendations
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                recommendation_url = f"{CREW_SERVICE_URL}/api/crew/recommendations"
                logger.info(f"Calling crew service at {recommendation_url}")
                response = await client.post(
                    recommendation_url,
                    json={
                        "userId": user_id,
                        "gpa": data.get('gpa'),
                        "sat": data.get('sat'),
                        "act": data.get('act'),
                        "interests": data.get('interests', [])
                    },
                )

                if response.status_code == 200:
                    recommendations = response.json()
                    return recommendations
                else:
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"Error from crew service: {response.text}"
                    )
        except httpx.RequestError as e:
            logger.error(f"Error calling crew service: {e}")
            raise HTTPException(status_code=503, detail="Crew service unavailable")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting crew recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/recommendations/{user_id}")
async def get_user_recommendations(user_id: str, token: Dict = Depends(verify_token)):
    """Get stored recommendations for a user."""
    try:
        # Verify user has access to this data
        requester_id = token.get("uid")
        if not requester_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        if requester_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this data")

        # Get user profile from Firestore
        user = await db_client.get_user_profile(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get recommendations from user profile
        recommendations = user.get("collegeRecommendations", {})
        if not recommendations:
            return {"recommendations": [], "message": "No recommendations found"}

        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))
