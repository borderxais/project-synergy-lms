import os
import logging
from fastapi import HTTPException
from openai import AsyncOpenAI
from dotenv import load_dotenv


logger = logging.getLogger('main')

# Load environment variables
logger.info("[STARTUP] Loading environment variables...")
load_dotenv()

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("[STARTUP] OpenAI API key not found in environment variables")
    raise ValueError("OpenAI API key not found in environment vasriables")
else:
    print(f"OpenAI API key found: {openai_api_key[:4]}...{openai_api_key[-4:]}")

logger.info("[STARTUP] OpenAI API key found")
logger.info(f"[STARTUP] Key preview: {openai_api_key[:4]}...{openai_api_key[-4:]}")

try:
    client = AsyncOpenAI(
        api_key=openai_api_key,
        timeout=30.0
    )
    logger.info("[STARTUP] OpenAI client initialized successfully")
    print("[STARTUP] OpenAI client initialized successfully")
except Exception as e:
    logger.error(f"[STARTUP] Failed to initialize OpenAI client: {str(e)}")
    print(f"[STARTUP] Failed to initialize OpenAI client: {str(e)}")
    raise

async def get_completion(prompt: str) -> str:
    """Get completion from OpenAI API."""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a college admissions expert. Generate detailed and specific responses in the exact format requested."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=16380
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Error getting completion: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )