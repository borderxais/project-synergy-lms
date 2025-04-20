from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type, Optional, Dict, Any, List

class ErrorHandlingInput(BaseModel):
    error_message: str = Field(..., description="The error message to analyze")
    data: Optional[Dict[str, Any]] = Field(None, description="Additional data for context")

class ErrorHandlingTool(BaseTool):
    name: str = "ErrorHandlingTool"
    description: str = "Analyzes errors and provides recovery strategies"
    args_schema: Type[BaseModel] = ErrorHandlingInput

    def _run(self, error_message: str, data: Optional[Dict[str, Any]] = None) -> str:
        """
        Analyze an error message and provide recovery strategies.
        """
        # Check for common error patterns
        if "DatetimeWithNanoseconds" in error_message:
            return """
            Error detected: Firebase timestamp serialization issue.
            
            Recovery strategy:
            1. Convert Firebase timestamps to ISO format strings
            2. Use sanitize_firebase_data() function on all data from Firestore
            3. Ensure all data is properly sanitized before processing
            
            Implementation details:
            - Check if the data contains nested timestamp objects
            - Apply the sanitization recursively to all nested objects
            """
        
        elif "student_profile" in error_message:
            return """
            Error detected: Issue with student profile data.
            
            Recovery strategy:
            1. Check if student profile exists and has required fields
            2. Use a simplified profile with only essential fields
            3. Handle missing fields gracefully with default values
            
            Implementation details:
            - Extract only the necessary fields from the profile
            - Provide default values for missing fields
            - Use a more robust schema validation
            """
        
        elif "Invalid value" in error_message:
            return """
            Error detected: Invalid data type or format.
            
            Recovery strategy:
            1. Convert complex data types to simple strings or numbers
            2. Remove any non-serializable objects
            3. Use a more strict data validation approach
            
            Implementation details:
            - Identify the specific field causing the issue
            - Convert to a compatible format
            - Implement proper type checking before processing
            """
        
        else:
            return f"""
            Unrecognized error: {error_message}
            
            General recovery strategy:
            1. Log the full error details for debugging
            2. Try with a simplified data structure
            3. Break down the operation into smaller steps
            4. Check for API rate limits or connection issues
            
            Implementation details:
            - Add more detailed logging
            - Implement retry logic with exponential backoff
            - Consider using a more robust error handling framework
            """