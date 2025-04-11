import os
import logging
import json
import requests
from fastapi import HTTPException
from dotenv import load_dotenv

logger = logging.getLogger('main')

# Load environment variables
logger.info("[STARTUP] Loading environment variables...")
load_dotenv()

# Get OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("[STARTUP] OpenAI API key not found in environment variables")
    logger.warning("OpenAI API key not found in environment variables. Some features may not work properly.")
    # Use a dummy key for development/testing - this won't work for actual API calls
    # but will allow the service to start
    openai_api_key = "dummy_key_for_development"
else:
    print(f"OpenAI API key found: {openai_api_key[:4]}...{openai_api_key[-4:]}")
    logger.info("[STARTUP] OpenAI API key found")
    logger.info(f"[STARTUP] Key preview: {openai_api_key[:4]}...{openai_api_key[-4:]}")

# Direct API call function to avoid client initialization issues
async def get_completion(prompt: str) -> str:
    """Get completion from OpenAI API using direct HTTP request."""
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai_api_key}"
        }
        
        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a college admissions expert. Generate detailed and specific responses in the exact format requested."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 16380
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            logger.error(f"Error from OpenAI API: {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error from OpenAI API: {response.text}"
            )
            
        result = response.json()
        return result["choices"][0]["message"]["content"]
        
    except Exception as e:
        logger.error(f"Error getting completion: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )