from crewai import Agent, Task, Crew, Process
from crewai.project import CrewBase, agent, crew, task
import yaml
import os
from pathlib import Path

from .tools.custom_tool import FirestoreAllCollegesTool
from .tools.roadmap_tool import FirestoreRoadmapTool
from .tools.error_handling_tool import ErrorHandlingTool

@CrewBase
class LmsCrew:
    def __init__(self):
        """Initialize the LmsCrew with agents and tasks configurations."""
        # Load configuration files
        self.agents_config = self._load_config('agents.yaml')
        self.tasks_config = self._load_config('tasks.yaml')
        
        # Initialize tools
        self.firestore_tool = FirestoreAllCollegesTool()
        self.roadmap_tool = FirestoreRoadmapTool()
        self.error_handling_tool = ErrorHandlingTool()
        
        # Initialize agents and tasks
        self.agents = {}
        self.tasks = {}

    def _load_config(self, filename):
        """Load configuration from YAML file."""
        config_path = Path(__file__).parent / 'config' / filename
        with open(config_path, 'r') as file:
            return yaml.safe_load(file)

    @agent
    def student_data_matcher(self) -> Agent:
        """Creates the student data matcher agent"""
        return Agent(
            config=self.agents_config['student_data_matcher'],
            tools=[self.firestore_tool],
            verbose=True
        )

    @agent
    def college_admission_advisor(self) -> Agent:
        return Agent(
            config=self.agents_config['college_admission_advisor'],
            verbose=True
        )
        
    @agent
    def roadmap_generator(self) -> Agent:
        """Creates the roadmap generator agent"""
        return Agent(
            config=self.agents_config['roadmap_generator'],
            tools=[self.roadmap_tool, self.error_handling_tool],
            verbose=True
        )

    @task
    def matching_task(self) -> Task:
        return Task(
            config=self.tasks_config['matching_task'],
        )

    @task
    def reporting_task(self) -> Task:
        return Task(
            config=self.tasks_config['reporting_task'],
            output_file='report.md'
        )
        
    @task
    def roadmap_task(self) -> Task:
        """Creates the roadmap generation task"""
        return Task(
            config=self.tasks_config['roadmap_task'],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the LmsCrew crew"""
        return Crew(
            agents=[self.student_data_matcher(), self.college_admission_advisor(), self.roadmap_generator()],
            tasks=[self.matching_task(), self.reporting_task(), self.roadmap_task()],
            process=Process.sequential,
            verbose=True,
        )
