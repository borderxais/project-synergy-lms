from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Import auth routes
# from src.auth.auth_routes import router as auth_router
from src.auth.auth_routes import router as auth_router

# Create FastAPI app
app = FastAPI(title="PrivSchool LMS Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth router
app.include_router(auth_router, tags=["Authentication"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting PrivSchool LMS Service on port 3001")
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)