# src/auth/auth_middleware.py
from fastapi import Request, HTTPException, Depends
from firebase_admin import auth
from config.firebase_config import FirebaseConfig
from functools import wraps

firebase = FirebaseConfig()

async def verify_firebase_token(request: Request):
    """Verify Firebase ID token from Authorization header."""
    authorization = request.headers.get("Authorization")
    
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization token")
    
    token = authorization.split("Bearer ")[1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        request.state.user = decoded_token
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

def require_auth(func):
    """Decorator to require authentication for routes."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        request = kwargs.get("request")
        if not request:
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
        
        if not request:
            raise HTTPException(status_code=500, detail="Request object not found")
        
        await verify_firebase_token(request)
        return await func(*args, **kwargs)
    
    return wrapper