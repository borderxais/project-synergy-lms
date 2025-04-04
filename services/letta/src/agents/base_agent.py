from abc import ABC, abstractmethod

class BaseAgent(ABC):
    """
    Base class for all Letta agents in the system.
    """
    
    def __init__(self, user_id, letta_client):
        """
        Initialize the base agent.
        
        Args:
            user_id: The ID of the user this agent is associated with
            letta_client: The LettaClient instance
        """
        self.user_id = user_id
        self.agent_id = f"{self.__class__.__name__}_{user_id}"
        self.letta_client = letta_client
        
        # Create or load the Letta agent
        try:
            # Try to load an existing agent
            self.agent = self.letta_client.agents.get(self.agent_id)
            print(f"Loaded existing agent: {self.agent_id}")
        except:
            # Create a new agent if one doesn't exist
            self.agent = self._create_new_agent()
            print(f"Created new agent: {self.agent_id}")
    
    @abstractmethod
    def _create_new_agent(self):
        """
        Create a new Letta agent with the appropriate configuration.
        This method should be implemented by subclasses.
        
        Returns:
            A new Letta agent instance
        """
        pass
    
    def save(self):
        """Save the agent's state."""
        # The new SDK handles state automatically
        print(f"Agent state managed by letta-client: {self.agent_id}")