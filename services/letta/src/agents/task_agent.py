from .base_agent import BaseAgent

class TaskAgent(BaseAgent):
    """
    Agent responsible for generating and updating task recommendations for students.
    """
    
    def _create_new_agent(self):
        """Create a new task recommendation agent."""
        # Define the agent's system prompt
        system_prompt = """
        You are a task recommendation agent for an educational platform. Your role is to:
        
        1. Generate personalized learning tasks based on student profiles
        2. Adjust task recommendations when student profiles change
        3. Ensure tasks are appropriate for the student's academic level and interests
        
        When recommending tasks, consider:
        - The student's current academic level and goals
        - Their learning style and preferences
        - Their interests and extracurricular activities
        - Their college and career aspirations
        """
        
        # Create the agent with the system prompt
        agent = self.letta_client.agents.create(
            agent_id=self.agent_id,
            system_prompt=system_prompt,
            human_name="Task Recommendation System",
            persona_name="Task Recommender",
            preset="memgpt_chat"
        )
        
        return agent
    
    def update_tasks(self, profile_analysis):
        """
        Update task recommendations based on profile analysis.
        
        Args:
            profile_analysis: Analysis of the student's profile
            
        Returns:
            A list of recommended tasks
        """
        # Send the profile analysis to the agent for task recommendations
        response = self.agent.chat(
            message=f"Based on this profile analysis, please recommend appropriate learning tasks for this student: {profile_analysis}"
        )
        
        # Parse the response to extract task recommendations
        # This is a simplified implementation - in a real system, you might want
        # to use more structured data and parsing
        tasks = self._parse_tasks_from_response(response.content)
        
        return tasks
    
    def _parse_tasks_from_response(self, response_text):
        """
        Parse task recommendations from the agent's response.
        
        Args:
            response_text: The text response from the agent
            
        Returns:
            A list of task recommendations
        """
        # Simple parsing logic - split by newlines and filter out empty lines
        # In a real implementation, you might want to use more sophisticated parsing
        lines = response_text.split('\n')
        tasks = [line.strip() for line in lines if line.strip()]
        
        return tasks