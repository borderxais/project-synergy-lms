from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type, Optional
import firebase_admin
from firebase_admin import credentials, firestore
import re
import os
import json
import base64
import logging
import binascii

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StudentProfileInput(BaseModel):
    gpa: float = Field(..., description="Student's GPA")
    sat_total: Optional[int] = Field(None, description="Student's SAT Total Score")
    act: Optional[int] = Field(None, description="Student's ACT Score")


# Initialize Firebase once at module level
try:
    # First try to get service account from environment variable
    service_account_base64 = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
    if service_account_base64 and len(service_account_base64) > 100:
        try:
            logger.info("Attempting to use Firebase service account from environment variable")
            logger.info(f"Service account key in base64: {service_account_base64}")
            # Decode base64 string to JSON string
            service_account_json = base64.b64decode(service_account_base64).decode('utf-8')
            service_account = json.loads(service_account_json)
            cred = credentials.Certificate(service_account)
            logger.info("Successfully loaded Firebase credentials from environment variable")
        except (binascii.Error, json.JSONDecodeError, ValueError) as e:
            logger.error(f"Failed to decode Firebase service account from environment: {e}")
            logger.info("Falling back to service account file")
            # Fall back to file
            cred = credentials.Certificate("/app/db/serviceAccountKey.json")
    else:
        # Fall back to file
        logger.info("Using Firebase service account from file")
        cred = credentials.Certificate("/app/db/serviceAccountKey.json")
    
    firebase_admin.initialize_app(cred)
    logger.info("Firebase Admin SDK initialized successfully")
    db = firestore.client()
except Exception as e:
    logger.error(f"Error initializing Firebase: {e}")
    raise

# Dynamic margins based on selectivity
MARGINS = {
    'highly_selective': {'gpa': 0.2, 'sat': 50, 'act': 1},
    'moderately_selective': {'gpa': 0.3, 'sat': 100, 'act': 2},
    'less_selective': {'gpa': 0.5, 'sat': 150, 'act': 3},
}

def get_selectivity_category(rate_str: str) -> str:
    if not rate_str:
        return 'less_selective'
    match = re.search(r"(\d+)", rate_str)
    if match:
        rate = float(match.group(1)) / 100
        if rate < 0.15:
            return 'highly_selective'
        elif rate < 0.4:
            return 'moderately_selective'
    return 'less_selective'

class FirestoreAllCollegesTool(BaseTool):
    name: str = "FirestoreAllCollegesTool"
    description: str = "Fetches all college documents from the Firestore 'US-Colleges' collection, and filters based on student's GPA, SAT, and ACT with dynamic margin."
    args_schema: Type[BaseModel] = StudentProfileInput

    def _run(self, gpa, sat_total, act) -> str:
        try:
            colleges_ref = db.collection('US-Colleges').stream()

            def is_reasonable_match(student_score, range_str, margin):
                if not range_str or not student_score:
                    return True
                match = re.findall(r"\d+", range_str)
                if len(match) >= 2:
                    low, high = map(int, match[:2])
                    return (low - margin) <= student_score <= (high + 2*margin)
                return True

            qualified_colleges = []

            for doc in colleges_ref:
                data = doc.to_dict()
                gpa_data = data.get("GPA")
                avg_gpa = self._calculate_avg_gpa(gpa_data) if gpa_data else None

                acceptance_data = data.get("Acceptance Rate", {})
                rate_str = acceptance_data.get("Rate", "")
                selectivity = get_selectivity_category(rate_str)
                margins = MARGINS[selectivity]

                # GPA filtering
                if avg_gpa is not None and gpa is not None and float(gpa) < (float(avg_gpa) - margins['gpa']):
                    continue

                # SAT filtering
                sat_ok = True
                sat_range = None
                if sat_total and "SAT" in data and isinstance(data["SAT"], dict):
                    sat_range = data["SAT"].get("Total")
                    sat_ok = is_reasonable_match(sat_total, sat_range, margin=margins['sat'])
                if not sat_ok and not act:
                    continue

                # ACT filtering
                act_ok = True
                act_range = data.get("ACT")
                if act and act_range:
                    act_ok = is_reasonable_match(act, act_range, margin=margins['act'])
                if not act_ok and not sat_ok:
                    continue

                qualified_colleges.append({
                    "University Name": data.get("University Name", "Unknown")
                })

            if not qualified_colleges:
                return "No qualified colleges found based on provided profile."

            return "\n---\n".join([str(item) for item in qualified_colleges])

        except Exception as e:
            return f"Failed to fetch and filter college data: {str(e)}"

    def _calculate_avg_gpa(self, gpa_dict: dict) -> float:
        if not gpa_dict:
            return 0.0

        total_weight = 0
        total_percentage = 0

        for range_str, percent_str in gpa_dict.items():
            if not range_str or not percent_str:
                continue

            try:
                if '+' in range_str:
                    midpoint = float(range_str.replace('+', '')) + 0.1
                else:
                    match = re.findall(r"\d+\.\d+", range_str)
                    if len(match) == 2:
                        midpoint = (float(match[0]) + float(match[1])) / 2
                    else:
                        continue
            except:
                continue

            try:
                if 'Less than 1' in percent_str:
                    percentage = 0.5
                elif match := re.search(r"(\d+(\.\d+)?)%", percent_str):
                    percentage = float(match.group(1))
                else:
                    continue
            except:
                continue

            total_weight += midpoint * percentage
            total_percentage += percentage

        return round(total_weight / total_percentage, 2) if total_percentage else 0.0
