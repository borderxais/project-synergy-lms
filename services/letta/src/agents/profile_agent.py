from .base_agent import BaseAgent

class ProfileAgent(BaseAgent):
    """
    Agent responsible for analyzing student profiles and identifying key characteristics.
    """
    
    def _create_new_agent(self):
        """Create a new profile analysis agent."""
        # Define the agent's system prompt
        system_prompt = """
        You are a profile analysis agent for an educational platform. Your role is to:
        
        1. Analyze student profile data to identify key characteristics
        2. Detect changes in the profile that might require adjustments to learning plans
        3. Provide insights about the student's learning style, interests, and academic needs
        
        When analyzing profiles, focus on:
        - Academic background and performance
        - Learning preferences and styles
        - Interests and extracurricular activities
        - College and career goals
        """
        
        # Create the agent with the system prompt
        agent = self.letta_client.agents.create(
            agent_id=self.agent_id,
            system_prompt=system_prompt,
            human_name="Student Profile System",
            persona_name="Profile Analyzer",
            preset="memgpt_chat"
        )
        
        return agent
    
    def analyze_profile(self, profile_data):
        """
        Analyze a student profile and identify key characteristics.
        
        Args:
            profile_data: The student profile data to analyze
            
        Returns:
            A dictionary containing profile analysis results
        """
        # Convert profile data to a string representation for the agent
        profile_str = self._format_profile_data(profile_data)
        
        # Send the profile data to the agent for analysis
        response = self.agent.chat(
            message=f"Please analyze this student profile and identify key characteristics: {profile_str}"
        )
        
        # Parse the response to extract profile analysis
        analysis = self._parse_analysis_from_response(response.content)
        
        # Save the agent's state
        self.save()
        
        return analysis
    
    def _format_profile_data(self, profile_data):
        """Format profile data as a string for the agent."""
        # Extract relevant fields from the profile data
        formatted_data = []
        
        # Basic information
        if 'displayName' in profile_data:
            formatted_data.append(f"Name: {profile_data['displayName']}")
        
        # Student profile information
        if 'studentProfile' in profile_data:
            student_profile = profile_data['studentProfile']
            
            # General info
            if 'generalInfo' in student_profile:
                general_info = student_profile['generalInfo']
                for key, value in general_info.items():
                    formatted_data.append(f"{key}: {value}")
            
            # High school profile
            if 'highSchoolProfile' in student_profile:
                hs_profile = student_profile['highSchoolProfile']
                for key, value in hs_profile.items():
                    formatted_data.append(f"{key}: {value}")
            
            # Interests
            if 'interests' in student_profile:
                interests = student_profile['interests']
                formatted_data.append(f"Interests: {', '.join(interests)}")
            
            # Extracurriculars
            if 'extracurriculars' in student_profile:
                extracurriculars = student_profile['extracurriculars']
                formatted_data.append(f"Extracurriculars: {extracurriculars}")
            
            # College preferences
            if 'collegePreferences' in student_profile:
                college_prefs = student_profile['collegePreferences']
                for key, value in college_prefs.items():
                    formatted_data.append(f"{key}: {value}")
        
        return "\n".join(formatted_data)
    
    def _parse_analysis_from_response(self, response_text):
        """
        Parse profile analysis from the agent's response.
        
        Args:
            response_text: The text response from the agent
            
        Returns:
            A dictionary containing profile analysis results
        """
        # Simple parsing - in a real implementation, you might want to use
        # a more sophisticated approach
        return {
            "raw_analysis": response_text,
            "timestamp": self.letta_client.utils.get_current_timestamp()
        }