from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from .tools.custom_tool import FirestoreAllCollegesTool

# Create tool instance
firestore_tool = FirestoreAllCollegesTool()

@CrewBase
class LmsCrew():
    """LmsCrew crew"""

    # YAML configuration files
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def student_data_matcher(self) -> Agent:
        return Agent(
            config=self.agents_config['student_data_matcher'],
            tools=[firestore_tool],
            verbose=True
        )

    @agent
    def college_admission_advisor(self) -> Agent:
        return Agent(
            config=self.agents_config['college_admission_advisor'],
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

    @crew
    def crew(self) -> Crew:
        """Creates the LmsCrew crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
