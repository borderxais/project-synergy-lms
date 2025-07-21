from fastapi import APIRouter, HTTPException, Request
from typing import Dict, Any
from firebase_admin import auth  
from db.firestore_client import FirestoreClient
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
db_client = FirestoreClient()


@router.post("/api/auth/register")
async def register_user(request: Request):
    """Register a new user and create their initial profile."""
    try:
        data = await request.json()
        
        # Create user in Users collection
        user_id = await db_client.create_user({
            'email': data['email'],
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'authProvider': data.get('authProvider', 'Email/Password'),
            'role': data.get('role', 'Parent')
        })
        
        return {"userId": user_id, "message": "User registered successfully"}
    except Exception as e:
        logger.error(f"Error in user registration: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/auth/onboarding")
async def complete_onboarding(request: Request):
    """Complete the onboarding process by creating student profile."""
    try:
        data = await request.json()
        user_id = data.get('userId')
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        
        # Create student profile
        student_id = await db_client.create_student({
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'currentGrade': data['currentGrade'],
            'currentSchool': data['currentSchool'],
            'zipCode': data['zipCode'],
            'unweightedGPA': data.get('unweightedGPA', ''),
            'weightedGPA': data.get('weightedGPA', ''),
            'clubs': data.get('clubs', []),
            'interests': data.get('interests', []),
            'sports': data.get('sports', []),
            'targetSchools': data.get('targetSchools', []),
            'testScores': data.get('testScores', {})
        }, user_id)
        
        return {
            "userId": user_id,
            "studentId": student_id,
            "message": "Onboarding completed successfully"
        }
    except Exception as e:
        logger.error(f"Error in onboarding: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/student/{student_id}/profile")
async def update_student_profile(student_id: str, request: Request):
    """Update student profile information."""
    try:
        data = await request.json()
        await db_client.update_student_profile(student_id, data)
        return {"message": "Profile updated successfully"}
    except Exception as e:
        logger.error(f"Error updating student profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/student/{student_id}")
async def get_student_profile(student_id: str):
    """Get student profile information."""
    try:
        profile = await db_client.get_student(student_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Student not found")
        return profile
    except Exception as e:
        logger.error(f"Error retrieving student profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/auth/google")
async def google_auth(request: Request):
    """Handle Google authentication."""
    try:
        data = await request.json()
        id_token = data.get('idToken')
        
        if not id_token:
            raise HTTPException(status_code=400, detail="ID token is required")
        
        # Verify the Google ID token
        try:
            decoded_token = auth.verify_id_token(id_token)
            user_id = decoded_token['uid']
            
            # Check if user exists
            user = await db_client.get_user_profile(user_id)
            
            if not user:
                # Create new user from Google data
                user_data = {
                    'uid': user_id,
                    'email': decoded_token.get('email', ''),
                    'firstName': decoded_token.get('name', '').split(' ')[0] if decoded_token.get('name') else '',
                    'lastName': decoded_token.get('name', '').split(' ')[-1] if decoded_token.get('name') else '',
                    'authProvider': 'google.com'
                }
                await db_client.create_or_update_google_user(user_data)
                user = await db_client.get_user_profile(user_id)
            
            # Format response to match frontend expectations
            return {
                "user": {
                    "id": user_id,  # Frontend expects 'id' instead of 'uid'
                    **user,  # Include all user profile data
                    "isOnboarded": user.get('isOnboarded', False)
                },
                "token": id_token  # Return the ID token that was sent
            }
        except Exception as e:
            logger.error(f"Error verifying Google token: {e}")
            raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")
            
    except Exception as e:
        logger.error(f"Error in Google auth: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/api/auth/check-user")
async def check_user(request: Request):
    """Check if user exists and get their onboarding status."""
    try:
        # Get token from Authorization header
        authorization = request.headers.get("Authorization")
        
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid authorization token")
        
        token = authorization.split("Bearer ")[1]
        
        # Verify token
        try:
            decoded_token = auth.verify_id_token(token)
            user_id = decoded_token['uid']
            
            # Get user from database
            user = await db_client.get_user_profile(user_id)
            
            if not user:
                return {"exists": False}
            
            return {
                "exists": True,
                "isOnboarded": user.get('isOnboarded', False),
                "profile": user
            }
        except Exception as e:
            logger.error(f"Error verifying token: {e}")
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
            
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error checking user: {e}")
        raise HTTPException(status_code=500, detail=str(e))
