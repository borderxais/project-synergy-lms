from pydantic import BaseModel, Field, RootModel
from typing import List, Optional
from datetime import datetime

class CollegeRecommendation(BaseModel):
    """College recommendation in the report"""
    College_Name: str = Field(..., description="Name of the recommended college")
    Reason: str = Field(..., description="Reason for recommending this college")

class ReportOutput(RootModel):
    """Output model for the reporting task"""
    root: List[CollegeRecommendation]

class RoadmapRecommendation(BaseModel):
    """Recommendation in the roadmap"""
    text: str = Field(..., description="The recommendation content")
    priority: str = Field(..., description="Priority level ('high', 'medium', 'low')")

class RoadmapTask(BaseModel):
    """Individual task in the roadmap"""
    id: str = Field(..., description="Unique identifier for the task")
    title: str = Field(..., description="Title of the task")
    description: str = Field(..., description="Detailed description of what needs to be done")
    dueDate: str = Field(..., description="Due date for the task")
    category: str = Field(..., 
        description="Category of the task",
        # Validates against exact categories from tasks.yaml
        pattern="^(Test Prep|Application|Financial Aid|Essay|Research|Extracurricular)$")
    priority: str = Field(..., 
        description="Priority level",
        pattern="^(high|medium|low)$")
    school: str = Field(..., description="School this task is for, or 'All Schools' if applicable")

class RoadmapOutput(BaseModel):
    """Main output model for the roadmap generation task"""
    tasks: List[RoadmapTask] = Field(..., description="List of tasks in the roadmap")
    recommendations: List[RoadmapRecommendation] = Field(..., description="List of recommendations")
