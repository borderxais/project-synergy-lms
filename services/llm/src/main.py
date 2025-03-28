from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import logging
import os
import traceback
import asyncio
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, ValidationError
from jose import JWTError, jwt
from openai import AsyncOpenAI
from dotenv import load_dotenv
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import sys
import uuid
import psycopg2
from psycopg2.extras import RealDictCursor
import uvicorn
from functools import lru_cache
import hashlib
import time
from collections import defaultdict
from starlette.responses import JSONResponse
from contextlib import contextmanager
import requests

from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds
from utils import days_until_deadline
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).resolve().parents[3]  # Go up 4 levels to reach project root
sys.path.append(str(project_root))

from db.firestore_client import FirestoreClient
from services.auth.src.auth.auth_routes import router as auth_router



# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('main')

# Initialize FastAPI app
app = FastAPI()

# Initialize Firestore client
db_client = FirestoreClient()

# Include auth routes
app.include_router(auth_router)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Allow both frontend and Node.js backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Request logging middleware
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log request details
        logger.info(f"[MIDDLEWARE] Received request: {request.method} {request.url.path}")
        logger.info(f"[MIDDLEWARE] Full URL: {request.url}")
        logger.info(f"[MIDDLEWARE] Headers: {dict(request.headers)}")
        
        # Log available routes
        routes = []
        for route in request.app.routes:
            routes.append({
                "path": route.path,
                "name": route.name,
                "methods": list(route.methods) if route.methods else []
            })
        logger.info(f"[MIDDLEWARE] Available routes: {json.dumps(routes, indent=2)}")
        
        try:
            body = await request.body()
            if body:
                try:
                    # Try to parse and pretty print JSON
                    json_body = json.loads(body)
                    logger.info(f"[MIDDLEWARE] Request body: {json.dumps(json_body, indent=2)}")
                except json.JSONDecodeError:
                    logger.info(f"[MIDDLEWARE] Request body (raw): {body.decode()}")
            else:
                logger.info("[MIDDLEWARE] Request body: None")
        except Exception as e:
            logger.error(f"[MIDDLEWARE] Error reading body: {str(e)}")
        
        # Log if route is not found
        if request.url.path not in [route.path for route in request.app.routes]:
            logger.warning(f"[DEBUG] Unhandled request to path: {request.url.path}")
            logger.warning(f"[DEBUG] Full URL: {request.url}")
            logger.warning(f"[DEBUG] Method: {request.method}")
            logger.warning(f"[DEBUG] Headers: {dict(request.headers)}")
            if body:
                try:
                    json_body = json.loads(body)
                    logger.warning(f"[DEBUG] Body: {json.dumps(json_body, indent=2)}")
                except:
                    logger.warning(f"[DEBUG] Body (raw): {body.decode()}")
        
        response = await call_next(request)
        logger.info(f"[MIDDLEWARE] Response status: {response.status_code}")
        if response.status_code >= 400:
            logger.error(f"[MIDDLEWARE] Error response: {response.status_code}")
            try:
                response_body = [chunk async for chunk in response.body_iterator]
                logger.error(f"[MIDDLEWARE] Response body: {response_body}")
            except:
                logger.error("[MIDDLEWARE] Could not read response body")
        
        return response

app.add_middleware(RequestLoggingMiddleware)

# Timeout middleware
class TimeoutMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            # Increase timeout to 200 seconds for long-running operations
            return await asyncio.wait_for(call_next(request), timeout=200.0)
        except asyncio.TimeoutError:
            logger.error(f"Request timeout: {request.url.path}")
            return JSONResponse(
                status_code=504,
                content={"detail": "Request timeout. Please try again."}
            )
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={"detail": str(e)}
            )

app.add_middleware(TimeoutMiddleware)

# Models
class Task(BaseModel):
    title: str
    description: str
    duration: str

class Milestone(BaseModel):
    title: str
    description: str
    deadline: str
    category: Optional[str] = None
    tasks: List[Task]

class Timeline(BaseModel):
    data: Dict[str, Any]

class Roadmap(BaseModel):
    milestones: List[Milestone]
    recommendations: List[str]
    timeline: Optional[Timeline] = None

class CollegePreferences(BaseModel):
    schoolCategories: List[str] = Field(default_factory=list)
    targetSchools: List[str] = Field(default_factory=list)
    earlyDecision: str = "none"

class GeneralInfo(BaseModel):
    currentSchool: str
    firstName: str
    lastName: str
    schoolType: str
    grade: int
    gender: str = "PreferNotToSay"

class HighSchoolProfile(BaseModel):
    currentClasses: List[str] = Field(default_factory=list)
    extracurriculars: List[str] = Field(default_factory=list)
    gpa: float
    weightedGpa: float
    plannedTests: List[str] = Field(default_factory=list)
    studyStylePreference: List[str] = Field(default_factory=list)
    preferredTestPrepMethod: Optional[str] = None

class StudentProfile(BaseModel):
    generalInfo: GeneralInfo
    collegePreferences: CollegePreferences
    highSchoolProfile: HighSchoolProfile
    interests: List[str] = Field(default_factory=list)

class SchoolAnalysisProfile(BaseModel):
    grade: int
    interests: List[str]
    plannedTests: List[str]

class SchoolAnalysisRequest(BaseModel):
    schools: List[str]
    studentProfile: SchoolAnalysisProfile

class TargetSchool(BaseModel):
    name: Optional[str] = None
    type: str  # "reach", "target", "safety"
    category: Optional[str] = None  # "Top10", "Top30", "IvyLeague", "Public", "UC"

class SchoolInfo(BaseModel):
    name: str
    deadlines: Dict[str, str]  # e.g., {"ED": "MM/DD or N/A", "EA": "MM/DD or N/A", "Regular": "MM/DD"}
    requirements: Dict[str, Any]
    admissionStats: Optional[Dict[str, Any]] = None

class SchoolAdmissionRequirements(BaseModel):
    tests: List[str] = Field(default_factory=list)
    scores: Dict[str, str] = Field(default_factory=dict)
    other: List[str] = Field(default_factory=list)

class SchoolAnalysis(BaseModel):
    schoolName: str
    overallFit: str
    keyPrograms: List[str] = Field(default_factory=list)
    admissionRequirements: SchoolAdmissionRequirements
    recommendations: List[str] = Field(default_factory=list)
    error: Optional[str] = None

class SchoolAnalysisRequest(BaseModel):
    schools: List[str]
    studentProfile: Dict[str, Any]

class SchoolAnalysisResponse(BaseModel):
    analyses: List[SchoolAnalysis]

# Load environment variables
logger.info("[STARTUP] Loading environment variables...")
load_dotenv()

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OpenAI API key not found in environment variables")

logger.info("[STARTUP] OpenAI API key found")
logger.info(f"[STARTUP] Key preview: {openai_api_key[:4]}...{openai_api_key[-4:]}")

try:
    client = AsyncOpenAI(
        api_key=openai_api_key,
        timeout=30.0
    )
    logger.info("[STARTUP] OpenAI client initialized successfully")
except Exception as e:
    logger.error(f"[STARTUP] Failed to initialize OpenAI client: {str(e)}")
    raise

async def get_completion(prompt: str) -> str:
    """Get completion from OpenAI API."""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a college admissions expert. Generate detailed and specific responses in the exact format requested."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=16380
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error getting completion: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )


def parse_deadline(deadline_str: str, year: int = None) -> datetime:
    """Parse deadline string into a datetime object, supporting multiple formats."""
    if not deadline_str:
        raise ValueError("Deadline string is empty or None")

    try:
        # First try YYYY-MM-DD format (e.g., "2025-03-15")
        try:
            return datetime.strptime(deadline_str, "%Y-%m-%d")
        except ValueError:
            pass

        # Then try MM-DD-YYYY format (e.g., "12-02-2025")
        try:
            return datetime.strptime(deadline_str, "%m-%d-%Y")
        except ValueError:
            pass

        # Finally try MM/DD format (e.g., "11/18")
        if '/' in deadline_str and len(deadline_str.split('/')) == 2:
            month, day = map(int, deadline_str.split('/'))
            if year is None:
                year = datetime.now().year
            return datetime(year, month, day)

        raise ValueError(f"Unrecognized date format: {deadline_str}")

    except Exception as e:
        raise ValueError(f"Invalid deadline format: {deadline_str}. Supported formats: 'MM/DD', 'YYYY-MM-DD', 'MM-DD-YYYY'. Error: {e}")


# Database connection class
class AsyncDBConnection:
    def __init__(self):
        self.pool = None

    async def __aenter__(self):
        if not self.pool:
            self.pool = await asyncpg.create_pool(
                user=os.getenv('DB_USER', 'postgres'),
                password=os.getenv('DB_PASSWORD', 'postgres'),
                database=os.getenv('DB_NAME', 'privschool'),
                host=os.getenv('DB_HOST', 'localhost'),
                port=int(os.getenv('DB_PORT', '5432'))
            )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.pool:
            await self.pool.close()

    async def fetchval(self, query, *args):
        async with self.pool.acquire() as conn:
            return await conn.fetchval(query, *args)

    async def fetch(self, query, *args):
        async with self.pool.acquire() as conn:
            return await conn.fetch(query, *args)

    async def execute(self, query, *args):
        async with self.pool.acquire() as conn:
            return await conn.execute(query, *args)


async def search_web_results(query: str) -> str:
    """Search the web for college-related information."""
    try:
        # Search for latest news and admissions info
        search_queries = [
            f"{query} admissions requirements 2025",
            f"{query} application deadlines 2025",
            f"{query} latest news admissions",
            f"{query} acceptance rate trends"
        ]
        
        all_results = []
        for q in search_queries:
            results = await search_web(query=q, domain="")
            if results:
                all_results.extend(results)

        # Get content from top results
        content = []
        for result in all_results[:3]:  # Get content from top 3 results
            if result.get('url'):
                try:
                    doc_content = await read_url_content(result['url'])
                    if doc_content:
                        content.append(doc_content)
                except:
                    continue

        if not content:
            return "No recent news available."

        # Combine and summarize content
        combined_content = "\n".join(content)
        
        # Use OpenAI to summarize the content
        summary_prompt = f"""
        Summarize the following information about {query} admissions, focusing on:
        1. Latest requirements and deadlines
        2. Recent changes in admissions policy
        3. Key statistics and trends
        4. Important dates and deadlines
        
        Information:
        {combined_content}
        
        Provide a concise summary focusing on the most recent and relevant information.
        """
        
        summary = await get_completion(summary_prompt)
        return summary.strip()

    except Exception as e:
        logger.error(f"Error searching web results: {e}")
        return "Could not retrieve latest information."


def convert_timestamps_to_str(obj):
    """Convert Firestore timestamps to string format recursively."""
    if isinstance(obj, dict):
        return {k: convert_timestamps_to_str(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_timestamps_to_str(v) for v in obj]
    elif str(type(obj)) == "<class 'google.cloud.firestore_v1.types.document.DocumentSnapshot'>":
        return obj.to_dict()
    elif str(type(obj)) == "<class 'google.api_core.datetime_helpers.DatetimeWithNanoseconds'>":
        return obj.isoformat()
    return obj

async def generate_roadmap_with_llm(profile_dict: dict, request_id: str, school_infos: List[dict]) -> Dict[str, Any]:
    """Generate a personalized roadmap based on student profile and college requirements."""
    try:
        # Convert Firestore timestamps to string format
        profile_dict = convert_timestamps_to_str(profile_dict)
        school_infos = convert_timestamps_to_str(school_infos)
        
        logger.info(f"[ROADMAP:{request_id}] Generating roadmap with profile: {json.dumps(profile_dict, indent=2)}")
        logger.info(f"[ROADMAP:{request_id}] School info: {json.dumps(school_infos, indent=2)}")
        
        # Parse profile into Pydantic model
        profile = StudentProfile(**profile_dict)
        
        # Get student's interests and target schools
        interests = profile.interests or ["general education"]
        target_schools = profile.collegePreferences.targetSchools
        if not target_schools:
            raise ValueError("At least one target school is required")
        
        # Create the prompt
        example_task = {
            "title": "Submit SAT Scores to UCLA",
            "description": "Send official SAT scores through College Board to UCLA (required for admission). Schedule early to ensure scores arrive before the deadline.",
            "dueDate": "2025-11-15",
            "category": "Application",
            "priority": "high",
            "school": "UCLA"  # Added school field
        }

        time_remaining_info = [
            f"{school}: {days_until_deadline(next((s['regularDeadline'] for s in school_infos if s['schoolName'] == school), None))} days"
            for school in target_schools
        ]
        
        prompt = f"""
        Generate a comprehensive college preparation roadmap for a student applying to multiple colleges.

        ### STUDENT PROFILE:
        - Grade: {profile.generalInfo.grade}
        - GPA: {profile.highSchoolProfile.gpa}
        - Weighted GPA: {profile.highSchoolProfile.weightedGpa}
        - Interests: {', '.join(interests)}
        - Planned Tests: {', '.join(profile.highSchoolProfile.plannedTests)}
        - Study Style: {', '.join(profile.highSchoolProfile.studyStylePreference)}

        ### TIME CONTEXT:
        - Current Date: {datetime.now().strftime("%Y-%m-%d")}
        - Time Remaining Until Application Deadlines:
        {', '.join(time_remaining_info)}

        Use this information to carefully schedule tasks **in a progressive and manageable way** based on time available.

        ### TARGET SCHOOLS AND REQUIREMENTS:
        {json.dumps(school_infos, indent=2)}

        ### TASK SCHEDULING RULES:
        1. **Task Scheduling Based on Deadlines**:
        - Prioritize schools with earlier deadlines.
        - Distribute tasks over time so they are manageable.
        - Schedule important tasks (e.g., SAT, essays) well before deadlines.
        - Avoid bunching too many tasks together in a short time.

        2. **Types of Tasks & Due Dates**:
        - **Common Tasks**: Tasks that apply to all schools (e.g., test prep, general application steps).
        - **School-Specific Tasks**: Unique tasks for each school (e.g., essays, financial aid).
        - **Grouped Tasks**: Tasks that can be done together for multiple schools.

        ### EXAMPLES OF TASKS WITH DEADLINES:

        #### **Common Task Example**
        - **Title:** SAT Preparation
        - **Description:** Study for the SAT and take practice tests to ensure a high score.
        - **Due Date:** 2025-10-01 (At least one month before any early deadlines)
        - **Category:** Test Prep
        - **Priority:** High
        - **School:** All Schools

        #### **School-Specific Task Example**
        - **Title:** Submit Common App Essay for UCLA
        - **Description:** Finalize and submit the Common App personal statement required for UCLA.
        - **Due Date:** 2025-10-25 (Two weeks before UCLA's deadline)
        - **Category:** Application
        - **Priority:** High
        - **School:** UCLA

        #### **Coordinated Task Example (Multiple Schools)**
        - **Title:** Request Letters of Recommendation
        - **Description:** Contact teachers for letters of recommendation. Ensure they are ready before the earliest deadline.
        - **Due Date:** 2025-09-15 (6 weeks before the earliest application deadline)
        - **Category:** Application
        - **Priority:** High
        - **School:** All Schools

        ### GENERAL RECOMMENDATIONS:
        Based on student's profile and target schools, provide **at least 3 recommendations** for the student about:
        - Application strategies
        - Extracurricular improvements
        - Time management for balancing school, tests, and activities

        ### RESPONSE FORMAT:
        Return a **JSON object** with these fields:
        1. `"tasks"`: A list of tasks, where each task has:
        - `"title"`, `"description"`, `"dueDate"`, `"category"`, `"priority"`, `"school"`

        2. `"recommendations"`: A list of **general recommendations** as **strings**.

        ### **IMPORTANT**: Return only the JSON object, without any markdown formatting or code blocks.
        """

        # Get LLM response
        response = await get_completion(prompt)
        logger.info(f"[ROADMAP:{request_id}] Raw LLM response: {response}")

        # Clean up response - remove markdown code blocks if present
        cleaned_response = response
        if cleaned_response.startswith("```"):
            # Find the first and last occurrence of ```
            first_block = cleaned_response.find("\n")
            last_block = cleaned_response.rfind("```")
            if first_block != -1 and last_block != -1:
                cleaned_response = cleaned_response[first_block:last_block].strip()

        # Parse and validate response
        try:
            data = json.loads(cleaned_response)
            if not isinstance(data, dict) or "tasks" not in data or "recommendations" not in data:
                raise ValueError("Invalid response format")
            
            # Validate each task has required fields
            for task in data["tasks"]:
                required_fields = ["title", "description", "dueDate", "category", "priority", "school"]
                if not all(field in task for field in required_fields):
                    raise ValueError(f"Task missing required fields: {task}")
                
                # Validate date format
                try:
                    task_date = parse_deadline(task["dueDate"])

                    # Find correct school info
                    school_info = next((s for s in school_infos if s.get("schoolName") == task["school"]), None)

                    # Ensure task date is before school deadline
                    if task["school"] != "All Schools" and school_info and "regularDeadline" in school_info:
                        school_deadline = parse_deadline(school_info["regularDeadline"])
                        if task_date > school_deadline:
                            raise ValueError(f"Task due date {task['dueDate']} is after application deadline for {task['school']}")
                except ValueError as e:
                    raise ValueError(f"Invalid date format in task: {task}")




            # Sort tasks by due date
            data["tasks"].sort(key=lambda x: x["dueDate"])

            return data

        except json.JSONDecodeError as e:
            logger.error(f"[ROADMAP:{request_id}] Failed to parse JSON: {str(e)}")
            logger.error(f"[ROADMAP:{request_id}] Cleaned response: {cleaned_response}")
            raise ValueError(f"Failed to parse JSON: {str(e)}")
        except ValueError as e:
            logger.error(f"[ROADMAP:{request_id}] Validation error: {str(e)}")
            raise ValueError(f"Validation error: {str(e)}")
        except Exception as e:
            logger.error(f"[ROADMAP:{request_id}] Error parsing response: {str(e)}")
            raise ValueError(f"Error parsing response: {str(e)}")

    except Exception as e:
        logger.error(f"[ROADMAP:{request_id}] Error generating roadmap: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse roadmap data: {str(e)}"
        )

@app.post("/generate-roadmap-from-db")
async def generate_roadmap_from_db(request: Request):
    try:
        data = await request.json()
        user_id = data.get('userId')
        target_schools = data.get('targetSchool')
        school_info = data.get('schoolInfo', {})

        if not user_id or not target_schools:
            raise HTTPException(status_code=400, detail="Missing userId or targetSchool")

        logger.info(f"Generating roadmap for user {user_id} targeting {target_schools}")

        # Get school data from Firestore if not provided
        if not school_info:
            logger.info(f"We did not get school info from the client, so we're fetching it from Firestore")
            school_doc = await db_client.get_all_documents('US-Colleges')
            if not school_doc:
                raise HTTPException(status_code=404, detail=f"School {target_schools} not found")
            school_info = school_doc

        # Get user profile from Firestore
        user_profile = await db_client.get_user_profile(user_id)
        if not user_profile or not user_profile.get('studentProfile'):
            raise HTTPException(status_code=404, detail=f"User profile {user_id} not found or incomplete")

        # Get student profile
        student_profile = user_profile.get('studentProfile')
        if not student_profile:
            raise HTTPException(status_code=400, detail="Student profile is empty")

        logger.info(f"Original school_info: {school_info}")

        # Generate roadmap using the combined data
        roadmap = await generate_roadmap_with_llm(
            student_profile,
            str(uuid.uuid4()),
            school_info
        )

        logger.info("Generated roadmap successfully")

        # Update user document with roadmap data
        await db_client.update_document('users', user_id, {
            "tasks": [
                {
                    **task,
                    "createdAt": datetime.now().isoformat(),
                    "updatedAt": datetime.now().isoformat(),
                    "isCompleted": False
                }
                for task in roadmap.get('tasks', [])
            ],
            "totalTasks": len(roadmap.get('tasks', [])),
            "recommendations": roadmap.get('recommendations', []),
            "lastTaskGeneratedAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        })

        logger.info("Stored roadmap in user profile")

        return JSONResponse({
            "success": True,
            "data": roadmap
        })

    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    logger.info("[STARTUP] Available routes:")
    for route in app.routes:
        logger.info(f"[STARTUP] {route.path} [{route.methods}]")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3003,
        reload=True,
        timeout_keep_alive=300,
        # timeout_notify=300,  # This parameter is not supported in your uvicorn version
        timeout_graceful_shutdown=300,
        limit_concurrency=10,
        backlog=128
    )
