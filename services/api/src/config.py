import os

# For local Docker development, the service names ('crew', 'llm') work as hostnames.
# In production on App Engine, these will be overridden by the full HTTPS URLs
# provided in the app.yaml configuration.

CREW_SERVICE_URL = os.getenv("CREW_SERVICE_URL", "http://crew:8003")
LLM_SERVICE_URL = os.getenv("LLM_SERVICE_URL", "http://llm:8002")
