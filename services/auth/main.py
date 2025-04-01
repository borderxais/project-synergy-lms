from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import logging
import traceback

# Print diagnostic information
print(f"Python version: {sys.version}")
print(f"Current working directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")
print(f"Files in src directory: {os.listdir('./src')}")
print(f"PYTHONPATH: {sys.path}")

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG for more verbose logging
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
logger.info("Starting auth service initialization")

# Import auth routes
try:
    print("Attempting to import auth_routes...")
    from src.auth.auth_routes import router as auth_router
    print("Successfully imported auth_routes")
except Exception as e:
    print(f"Error importing auth_routes: {e}")
    traceback.print_exc()
    sys.exit(1)

# Create FastAPI app
app = FastAPI(title="PrivSchool LMS Service")
logger.info("FastAPI app created")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("CORS middleware configured")

# Include auth router
try:
    app.include_router(auth_router, tags=["Authentication"])
    logger.info("Auth router included successfully")
except Exception as e:
    logger.error(f"Error including auth router: {e}")
    print(f"Error including auth router: {e}")
    traceback.print_exc()

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint called")
    return {"status": "healthy"}

if __name__ == "__main__":
    try:
        import uvicorn
        logger.info("Starting PrivSchool LMS Service on port 3001")
        print("Starting server at http://localhost:3001")
        print("Press CTRL+C to stop the server")
        
        # Check if uvicorn is properly installed
        print(f"Uvicorn version: {uvicorn.__version__}")
        
        # Run the server
        uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True, log_level="debug")
    except ImportError as e:
        logger.error(f"Import error: {e}")
        print(f"ERROR: Missing dependency - {e}")
        print("Please install required packages with: python3 -m pip install -r src/Requirements.txt")
        traceback.print_exc()
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        print(f"ERROR: Failed to start server - {e}")
        traceback.print_exc()