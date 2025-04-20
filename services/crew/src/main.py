from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import warnings
import sys
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Suppress pysbd warnings
warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# Create FastAPI app
app = FastAPI(
    title="PrivSchool LMS Crew Service",
    description="AI-powered college recommendations using CrewAI",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from .routes import recommendations_router, roadmap_router, health_router

# Include the API routers
app.include_router(recommendations_router)
app.include_router(roadmap_router)

# Include the health check router
app.include_router(health_router)

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting PrivSchool LMS Crew Service on port 8003")
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)