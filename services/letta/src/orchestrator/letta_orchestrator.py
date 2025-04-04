import os
from letta_client import Letta
from firebase_admin import firestore
from ..agents.task_agent import TaskAgent
from ..agents.profile_agent import ProfileAgent
from ..config.firebase_config import firebase_config

class LettaOrchestrator:
    """
    Orchestrates multiple Letta agents and manages their state and communication.
    """
    
    def __init__(self):
        """Initialize the Letta orchestrator with its agents."""
        # Initialize Letta client with local mode
        self.letta_client = Letta(base_url="http://localhost:8283")
        
        # API keys can be set if needed
        # self.letta_client.api_key = os.getenv("LETTA_API_KEY")
        # self.letta_client.llm_api_key = os.getenv("OPENAI_API_KEY")
        
        # Initialize agent instances for different tasks
        self.agents = {}
        
        print("Letta Orchestrator initialized in local mode")
    
    def get_or_create_agent(self, user_id, agent_type):
        """
        Get an existing agent for a user or create a new one if it doesn't exist.
        
        Args:
            user_id: The ID of the user
            agent_type: The type of agent to create (e.g., "task", "profile")
            
        Returns:
            An agent instance
        """
        agent_key = f"{user_id}_{agent_type}"
        
        if agent_key not in self.agents:
            # Create a new agent based on the type
            if agent_type == "task":
                self.agents[agent_key] = TaskAgent(user_id, self.letta_client)
            elif agent_type == "profile":
                self.agents[agent_key] = ProfileAgent(user_id, self.letta_client)
            else:
                raise ValueError(f"Unknown agent type: {agent_type}")
        
        return self.agents[agent_key]
    
    def process_profile_update(self, user_id, user_data):
        """
        Process a user profile update with the appropriate agents.
        
        Args:
            user_id: The ID of the user
            user_data: The updated user data
        """
        # Get or create a profile agent for this user
        profile_agent = self.get_or_create_agent(user_id, "profile")
        
        # Process the profile update with the profile agent
        profile_analysis = profile_agent.analyze_profile(user_data)
        
        # Get or create a task agent for this user
        task_agent = self.get_or_create_agent(user_id, "task")
        
        # Update task recommendations based on profile analysis
        task_recommendations = task_agent.update_tasks(profile_analysis)
        
        print(f"Generated new task recommendations for user {user_id}")
        
        # Store the updated recommendations in Firestore
        self._store_recommendations(user_id, task_recommendations)
    
    def _store_recommendations(self, user_id, recommendations):
        """
        Store the recommendations in Firestore.
        
        Args:
            user_id: The ID of the user
            recommendations: The recommendations to store
        """
        # Get Firestore client
        db = firebase_config.firestore_client
        
        # Reference to the user's recommendations document
        recommendations_ref = db.collection('recommendations').document(user_id)
        
        # Update the recommendations
        recommendations_ref.set({
            'tasks': recommendations,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }, merge=True)