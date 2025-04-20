from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import warnings
from typing import Dict

from .crew import LmsCrew

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

@app.post("/api/crew/recommendations")
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

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting PrivSchool LMS Crew Service on port 8003")
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
