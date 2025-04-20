# Crew Service

This service provides college recommendation functionality using CrewAI framework. It matches student profiles with college admission requirements and provides personalized college recommendations.

## Features

- Student profile matching with college requirements
- Dynamic margin-based filtering based on college selectivity
- Personalized college recommendations with detailed justifications
- Integration with Firestore database for college data

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Place your Firebase credentials file (`privschool-d978c-firebase-adminsdk-fbsvc-2790f95b33.json`) in the root directory

## Usage

Run the service:
```bash
python -m src.main
```

### Available Commands

- `run()`: Run the crew with default student profile
- `train(n_iterations, filename)`: Train the crew for specified iterations
- `replay(task_id)`: Replay a specific task execution
- `test(n_iterations, model_name)`: Test crew execution with specified parameters

## Configuration

- Agent configurations are in `src/config/agents.yaml`
- Task configurations are in `src/config/tasks.yaml`

## Dependencies

- crewai>=0.16.0
- langchain>=0.1.0
- pyyaml>=6.0.1
- python-dotenv>=1.0.0
- firebase-admin
