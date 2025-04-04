import os
from dotenv import load_dotenv
from letta_client import Letta

# Load environment variables
load_dotenv()

def test_letta_client():
    """Test the Letta client in local mode."""
    try:
        # Initialize the Letta client in local mode
        client = Letta(base_url="http://localhost:8283")
        
        print("Letta client initialized successfully in local mode")

        # Try to search for agents
        try:
            response = client.agents.search()
            print(f"Connected. Found {len(response.agents)} agents.")
        except Exception as e:
            print(f"Could not connect to local server: {e}")
            print("Make sure the local Letta server is running on port 8283")
        
        return True
    except Exception as e:
        print(f"Error initializing Letta client: {e}")
        return False

if __name__ == "__main__":
    print("Testing Letta client...")
    success = test_letta_client()
    if success:
        print("Test completed.")
    else:
        print("Test failed.")
