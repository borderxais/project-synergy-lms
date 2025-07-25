from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

# Import routes
from src.routes import student_routes, school_routes, onboarding_routes, recommendation_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="PrivSchool LMS API",
    description="API for the PrivSchool Learning Management System",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://privschoolprep.com",
        "http://localhost:3000", # Common for React
        "http://localhost:8080", # Common for Angular/Vue
        "http://localhost:5173"  # Common for Vite
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(student_routes.router, tags=["Students"])
app.include_router(school_routes.router, tags=["Schools"])
app.include_router(onboarding_routes.router, tags=["Onboarding"])
app.include_router(recommendation_routes.router, tags=["Recommendations"])

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting PrivSchool LMS API Service on port 3002")
    uvicorn.run("main:app", host="0.0.0.0", port=3002, reload=True)