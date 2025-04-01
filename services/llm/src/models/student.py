from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class GeneralInfo(BaseModel):
    currentSchool: str
    firstName: str
    lastName: str
    schoolType: str
    grade: int
    gender: str = "PreferNotToSay"

class CollegePreferences(BaseModel):
    schoolCategories: List[str] = Field(default_factory=list)
    targetSchools: List[str] = Field(default_factory=list)
    earlyDecision: str = "none"

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