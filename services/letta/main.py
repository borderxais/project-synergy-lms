import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from src.api.routes import router as api_router
from src.listeners.firestore_listener import start_firestore_listeners

# Load environment variables
load_dotenv()

app = FastAPI(title="Letta Agent Orchestrator")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    # Start Firestore listeners when the application starts
    start_firestore_listeners()

@app.on_event("shutdown")
async def shutdown_event():
    # Cleanup resources if needed
    pass

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)