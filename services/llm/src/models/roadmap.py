from typing import List, Dict, Any, Optional
from pydantic import BaseModel

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