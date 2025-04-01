import json
import logging
import uuid
import traceback
from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse

# from ..models.roadmap import Roadmap
from models.roadmap import Roadmap
from models.student import StudentProfile
from llm_services.openai_service import get_completion
from utils.date_utils import parse_deadline, days_until_deadline
from utils.data_conversion import convert_timestamps_to_str
from db.firestore_client import FirestoreClient

router = APIRouter()
logger = logging.getLogger('main')
db_client = FirestoreClient()

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

@router.post("/generate-roadmap-from-db")
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