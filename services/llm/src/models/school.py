
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

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