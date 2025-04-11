import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import sys

# Add project root to Python path - Docker-friendly approach
try:
    # Try using the Docker container path structure first
    if os.path.exists('/app'):
        project_root = Path('/app')
    else:
        # Fall back to the local development path structure
        project_root = Path(__file__).resolve().parents[3]  # Go up 3 levels to reach project root
    sys.path.append(str(project_root))
except IndexError:
    # If we get an IndexError, we're probably in the Docker container
    project_root = Path('/app')
    sys.path.append(str(project_root))

# Try to import middleware modules with different approaches
try:
    from middleware.logging import RequestLoggingMiddleware
    from middleware.timeout import TimeoutMiddleware
except ModuleNotFoundError:
    # If that fails, try a different approach
    sys.path.append('/app/src')
    try:
        from middleware.logging import RequestLoggingMiddleware
        from middleware.timeout import TimeoutMiddleware
    except ModuleNotFoundError:
        # If all else fails, create dummy middleware
        from fastapi import Request
        
        class RequestLoggingMiddleware:
            async def __call__(self, request: Request, call_next):
                return await call_next(request)
                
        class TimeoutMiddleware:
            async def __call__(self, request: Request, call_next):
                return await call_next(request)
        
        logging.warning("Could not import middleware modules, using dummy middleware instead")

# Try to import auth_router with different approaches
try:
    # First try the Docker container path
    from services.auth.src.auth.auth_routes import router as auth_router
except ModuleNotFoundError:
    try:
        # Then try a relative import
        sys.path.append('/app/services')
        from auth.src.auth.auth_routes import router as auth_router
    except ModuleNotFoundError:
        # If all else fails, create a dummy router
        from fastapi import APIRouter
        auth_router = APIRouter()
        logging.warning("Could not import auth_router, using a dummy router instead")

from routes.roadmap import router as roadmap_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('main')

# Load environment variables
logger.info("[STARTUP] Loading environment variables...")
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Include routers
app.include_router(auth_router)
app.include_router(roadmap_router)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Allow both frontend and Node.js backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Add middleware
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(TimeoutMiddleware)

if __name__ == "__main__":
    import uvicorn
    logger.info("[STARTUP] Available routes:")
    for route in app.routes:
        logger.info(f"[STARTUP] {route.path} [{route.methods}]")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3003,
        reload=True,
        timeout_keep_alive=300,
        timeout_graceful_shutdown=300,
        limit_concurrency=10,
        backlog=128
    )