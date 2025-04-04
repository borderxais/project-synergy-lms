from fastapi import APIRouter, Depends, HTTPException, Body
from ..orchestrator.letta_orchestrator import LettaOrchestrator
from ..config.firebase_config import firebase_config

router = APIRouter()

# Create a global orchestrator instance
orchestrator = LettaOrchestrator()

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

@router.post("/trigger-analysis/{user_id}")
async def trigger_analysis(user_id: str):
    """
    Manually trigger a profile analysis for a user.
    
    Args:
        user_id: The ID of the user to analyze
    """
    try:
        # Get Firestore client
        db = firebase_config.firestore_client
        
        # Get the user data from Firestore
        user_doc = db.collection('users').document(user_id).get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        
        user_data = user_doc.to_dict()
        
        # Process the profile with the orchestrator
        orchestrator.process_profile_update(user_id, user_data)
        
        return {"status": "success", "message": f"Analysis triggered for user {user_id}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations/{user_id}")
async def get_recommendations(user_id: str):
    """
    Get the current recommendations for a user.
    
    Args:
        user_id: The ID of the user
    """
    try:
        # Get Firestore client
        db = firebase_config.firestore_client
        
        # Get the recommendations from Firestore
        recommendations_doc = db.collection('recommendations').document(user_id).get()
        
        if not recommendations_doc.exists:
            return {"status": "not_found", "message": "No recommendations found for this user"}
        
        recommendations = recommendations_doc.to_dict()
        
        return {"status": "success", "recommendations": recommendations}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))