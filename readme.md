# Synergy LMS

A comprehensive Learning Management System with multiple portals and microservices architecture.

## Project Structure

The project follows a monorepo structure:

- `/packages`: Frontend applications
  - `student-portal`: Portal for students
  - `teacher-portal`: Portal for teachers
  - `parent-portal`: Portal for parents
  - `admin-portal`: Portal for administrators
  - `landing-page`: Main landing page

- `/services`: Backend microservices
  - `auth`: Authentication service
  - `api`: Main API service
  - `llm`: LLM-based services for roadmap generation

- `/db`: Shared database utilities

## Services Architecture

The backend is composed of three microservices:

1. **Auth Service**: Handles user authentication and authorization using Firebase Auth
2. **API Service**: Provides core API functionality for the application
3. **LLM Service**: Generates personalized roadmaps using OpenAI

## Docker Setup

The project includes Docker configuration for all backend services. To run the services using Docker:

```bash
# Build and start all services
docker compose up --build

# Start services in detached mode
docker compose up -d

# Stop all services
docker compose down
```

### Service Ports

When running with Docker, the services are accessible at:

- Auth Service: http://localhost:3001
- API Service: http://localhost:3002
- LLM Service: http://localhost:3003

## Required Environment Files

The project requires several environment files to function properly:

### Root-level .env file

Create a `.env` file in the project root with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

This file is used by Docker Compose to inject environment variables into containers.

### Auth Service .env file

Create a `.env` file in `/services/auth/` with:

```env
PORT=8000
DEBUG=True
```

### API Service .env file

Create a `.env` file in `/services/api/` with:

```env
PORT=8001
DEBUG=True
```

### LLM Service .env file

Create a `.env` file in `/services/llm/src/` with:

```env
PORT=8002
DEBUG=True
OPENAI_API_KEY=your_openai_api_key_here
```

## Firebase Configuration

The services require a Firebase service account key file:

- Place your `serviceAccountKey.json` file in the `/db/` directory
- This file is used by all services to authenticate with Firebase
- This file is gitignored to prevent credentials from being committed

## Service Communication in Docker

Services communicate with each other using their service names in the Docker network, not localhost:

- Auth Service: http://auth:8000
- API Service: http://api:8001
- LLM Service: http://llm:8002

## Development Setup

### Prerequisites

- Node.js (for frontend packages)
- Python 3.8+ (for backend services)
- Docker and Docker Compose (for containerized deployment)
- Firebase account and project
- OpenAI API key (for LLM service)

### Running Services Locally (Alternative to Docker)

Each service can also be run locally without Docker:

```bash
# Auth Service
cd services/auth
python -m pip install -r requirements.txt
python main.py

# API Service
cd services/api
python -m pip install -r requirements.txt
python main.py

# LLM Service
cd services/llm
python -m pip install -r src/requirements.txt
python main.py
```

## Known Issues and Solutions

### Firestore Sentinel Serialization

The system handles Firestore `SERVER_TIMESTAMP` objects by:

- Using string representations of Sentinel objects when communicating between services
- Converting these strings to actual Firestore `SERVER_TIMESTAMP` objects before saving to the database

### Firebase Setup

If you need to set up your own Firebase project:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Set up Firebase Authentication with Google Sign-In enabled
3. Create a Firestore database with the same schema
4. Generate a service account key:
   - Go to **Project Settings > Service accounts**
   - Click **"Generate new private key"**
   - Save the JSON file
   - Copy the downloaded JSON file to `db/serviceAccountKey.json`