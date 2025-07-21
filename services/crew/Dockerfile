FROM python:3.11-slim

WORKDIR /app

# Copy and install requirements. Paths are relative to the Docker build context.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and the db directory
COPY src/ ./src/
COPY db/ ./db/

# Set Python path to include the root app directory, allowing imports from src and db
ENV PYTHONPATH=/app

# The PORT environment variable is set by App Engine.
# The default is 8080. Your application must listen on this port.
# The --reload flag is removed for production.
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
