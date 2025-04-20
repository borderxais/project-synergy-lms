# from google.cloud import firestore
from typing import List, Dict, Any, Optional
import logging
from datetime import datetime
import json
import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
import traceback
from google.cloud.firestore_v1.transforms import Sentinel

def replace_sentinel_strings(obj):
    """Recursively replace Sentinel string or actual sentinel object with Firestore server timestamp."""
    if isinstance(obj, dict):
        return {k: replace_sentinel_strings(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_sentinel_strings(v) for v in obj]
    elif isinstance(obj, str) and "Sentinel" in obj:
        return firestore.SERVER_TIMESTAMP
    elif isinstance(obj, Sentinel):  # Handle actual Sentinel objects
        return firestore.SERVER_TIMESTAMP
    return obj


logger = logging.getLogger(__name__)

class FirestoreClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirestoreClient, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
            
        try:
            # Get the directory where this file is located
            current_dir = Path(__file__).parent
            cred_path = current_dir / "serviceAccountKey.json"
            
            # Initialize Firebase Admin only if not already initialized
            if not firebase_admin._apps:
                logger.info("Initializing Firebase Admin SDK for Python server...")
                cred = credentials.Certificate(str(cred_path))
                firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK initialized successfully for Python server")
            else:
                logger.info("Using existing Firebase Admin SDK instance in Python server")

            self.db = firestore.client()
            logger.info("Successfully got Firestore client")
            self._initialized = True
        except Exception as e:
            logger.error(f"Failed to initialize Firestore client: {e}")
            raise

    async def create_user(self, user_data: Dict[str, Any]) -> str:
        """Create a new user in the users collection."""
        try:
            user_ref = self.db.collection('users').document(user_data['uid'])
            user_ref.set({
                'uid': user_data['uid'],
                'displayName': f"{user_data['firstName']} {user_data['lastName']}",
                'email': user_data['email'],
                'isOnboarded': False,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'lastLoginAt': firestore.SERVER_TIMESTAMP,
                'lastSignInMethod': user_data.get('authProvider', 'email'),
                'tasks': [],
                'totalTasks': 0
            })
            logger.info(f"Successfully created user with ID: {user_ref.id}")
            return user_ref.id
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            raise

    async def update_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> None:
        """Update a user profile in Firestore."""
        try:
            logger.info(f"Updating user profile for {user_id}")
            
            # Get a reference to the user document
            user_ref = self.db.collection('users').document(user_id)
            
            # Check if the document exists
            user_doc = user_ref.get()
            if not user_doc.exists:
                logger.warning(f"User document {user_id} does not exist, creating it")
                # Create the document with the provided data
                user_ref.set(profile_data)
                return
            
            # If the document exists, update it based on the structure of profile_data
            if 'studentProfile' in profile_data:
                logger.info("Found studentProfile in profile_data, using nested structure")
                
                # Use the provided studentProfile structure directly
                # Process the data to handle Sentinel strings before updating
                sanitized_profile_data = replace_sentinel_strings(profile_data)
                
                # For nested structures, we need to update field by field to handle SERVER_TIMESTAMP correctly
                for key, value in sanitized_profile_data.items():
                    # Handle nested dictionaries separately to avoid Sentinel serialization issues
                    if isinstance(value, dict):
                        for nested_key, nested_value in value.items():
                            field_path = f"{key}.{nested_key}"
                            user_ref.update({field_path: nested_value})
                    else:
                        user_ref.update({key: value})
                
                logger.info("Updated user document with provided studentProfile structure")
            elif 'tasks' in profile_data:
                # This is a task update, preserve the existing studentProfile
                logger.info("Found tasks in profile_data, updating tasks")
                
                # Extract tasks and other top-level fields
                tasks = profile_data.pop('tasks', [])
                
                # First update all non-task fields
                if profile_data:
                    sanitized_data = {}
                    for key, value in profile_data.items():
                        if isinstance(value, str) and "Sentinel" in value:
                            sanitized_data[key] = firestore.SERVER_TIMESTAMP
                        else:
                            sanitized_data[key] = value
                    
                    if sanitized_data:
                        user_ref.update(sanitized_data)
                        logger.info(f"Updated non-task fields: {list(sanitized_data.keys())}")
                
                # Then update tasks separately
                if tasks:
                    # Instead of trying to sanitize the existing tasks, create a completely new array
                    # with clean values to avoid any Sentinel serialization issues
                    clean_tasks = []
                    
                    for task in tasks:
                        # Create a new task dictionary with clean values
                        clean_task = {}
                        for k, v in task.items():
                            # Special handling for timestamp fields
                            if k in ['createdAt', 'updatedAt']:
                                # Always use a fresh SERVER_TIMESTAMP for these fields
                                clean_task[k] = firestore.SERVER_TIMESTAMP
                            else:
                                # Copy other fields as is
                                clean_task[k] = v
                        
                        clean_tasks.append(clean_task)
                    
                    # Update tasks field with completely clean tasks
                    logger.info(f"Updating tasks array with {len(clean_tasks)} clean tasks")
                    
                    # Use a direct update without any further processing
                    user_ref.update({"tasks": clean_tasks})
                    logger.info(f"Successfully updated tasks array")
                
                logger.info("Updated user document with tasks and other fields")
            else:
                # This is a simple update, just update the fields provided
                logger.info("Simple update, updating fields directly")
                
                # Process the data to handle Sentinel strings before updating
                sanitized_data = replace_sentinel_strings(profile_data)
                user_ref.update(sanitized_data)
                
                logger.info(f"Updated user document with fields: {list(sanitized_data.keys())}")
        except Exception as e:
            logger.error(f"Error updating user profile: {e}")
            logger.error(f"Error details: {traceback.format_exc()}")
            raise

    async def create_task(self, user_id: str, task_data: Dict[str, Any]) -> str:
        """Create a new task in the tasks collection."""
        try:
            # Create task document
            task_ref = self.db.collection('tasks').document()
            task_data.update({
                'userId': user_id,
                'isCompleted': False,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP
            })
            task_ref.set(task_data)

            # Update user's tasks array and increment total tasks
            user_ref = self.db.collection('users').document(user_id)
            user_ref.update({
                'tasks': firestore.ArrayUnion([f"tasks/{task_ref.id}"]),
                'totalTasks': firestore.Increment(1)
            })

            logger.info(f"Successfully created task with ID: {task_ref.id}")
            return task_ref.id
        except Exception as e:
            logger.error(f"Error creating task: {e}")
            raise

    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user's profile by ID."""
        try:
            user_ref = self.db.collection('users').document(user_id)
            user = user_ref.get()
            if user.exists:
                data = user.to_dict()
                logger.info(f"Found user profile: {json.dumps(data, default=str)}")
                return data
            logger.warning(f"User profile not found for ID: {user_id}")
            return None
        except Exception as e:
            logger.error(f"Error getting user profile: {e}")
            raise

    async def get_all_documents(self, collection: str) -> List[Dict[str, Any]]:
        """Get all documents from a Firestore collection, including document IDs."""
        try:
            docs = self.db.collection(collection).stream()
            return [{**doc.to_dict(), "doc_id": doc.id} for doc in docs if doc.exists]
        except Exception as e:
            logger.error(f"Error getting documents from {collection}: {e}")
            raise


    async def get_all_documents(self, collection: str) -> List[Dict[str, Any]]:
        """Get all documents from a Firestore collection."""
        try:
            docs = self.db.collection(collection).stream()
            return [doc.to_dict() for doc in docs if doc.exists]
        except Exception as e:
            logger.error(f"Error getting documents from {collection}: {e}")
            raise


    async def update_document(self, collection: str, doc_id: str, data: Dict[str, Any]) -> None:
        """Update a document in any collection."""
        try:
            doc_ref = self.db.collection(collection).document(doc_id)
            doc_ref.update(data)
            logger.info(f"Successfully updated document {doc_id} in {collection}")
        except Exception as e:
            logger.error(f"Error updating document in {collection}: {e}")
            raise
            
    def update_document_sync(self, collection: str, doc_id: str, data: Dict[str, Any]) -> None:
        """Synchronous version of update_document."""
        try:
            doc_ref = self.db.collection(collection).document(doc_id)
            doc_ref.update(data)
            logger.info(f"Successfully updated document {doc_id} in {collection}")
        except Exception as e:
            logger.error(f"Error updating document in {collection}: {e}")
            raise

    async def get_tasks(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all tasks for a user."""
        try:
            tasks = []
            tasks_ref = self.db.collection('tasks').where('userId', '==', user_id)
            task_docs = tasks_ref.stream()
            
            for doc in task_docs:
                task_data = doc.to_dict()
                task_data['id'] = doc.id
                tasks.append(task_data)
            
            return tasks
        except Exception as e:
            logger.error(f"Error getting tasks for user {user_id}: {e}")
            raise

    async def update_task(self, task_id: str, task_data: Dict[str, Any]) -> None:
        """Update a task document."""
        try:
            task_ref = self.db.collection('tasks').document(task_id)
            task_data['updatedAt'] = firestore.SERVER_TIMESTAMP
            task_ref.update(task_data)
            logger.info(f"Successfully updated task {task_id}")
        except Exception as e:
            logger.error(f"Error updating task: {e}")
            raise
    
    # Add this method to your FirestoreClient class
    async def create_or_update_google_user(self, user_data: Dict[str, Any]) -> str:
        """Create or update a user from Google authentication data."""
        try:
            user_id = user_data['uid']
            user_ref = self.db.collection('users').document(user_id)
            
            # Check if user exists
            user = user_ref.get()
            
            if user.exists:
                # Update existing user
                user_ref.update({
                    'lastLoginAt': firestore.SERVER_TIMESTAMP,
                    'lastSignInMethod': 'google.com'
                })
                logger.info(f"Updated existing Google user: {user_id}")
            else:
                # Create new user
                user_ref.set({
                    'uid': user_id,
                    'displayName': user_data.get('displayName', ''),
                    'email': user_data.get('email', ''),
                    'firstName': user_data.get('firstName', ''),
                    'lastName': user_data.get('lastName', ''),
                    'photoURL': user_data.get('photoURL', ''),
                    'isOnboarded': False,
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    'lastLoginAt': firestore.SERVER_TIMESTAMP,
                    'lastSignInMethod': 'google.com',
                    'tasks': [],
                    'totalTasks': 0
                })
                logger.info(f"Created new Google user: {user_id}")
            
            return user_id
        except Exception as e:
            logger.error(f"Error creating/updating Google user: {e}")
            raise
    

    # Student-related methods
    async def get_student(self, student_id: str) -> Optional[Dict[str, Any]]:
        """Get a student profile by ID."""
        try:
            student_ref = self.db.collection('students').document(student_id)
            student = student_ref.get()
            if student.exists:
                data = student.to_dict()
                data['id'] = student.id
                return data
            logger.warning(f"Student not found for ID: {student_id}")
            return None
        except Exception as e:
            logger.error(f"Error getting student: {e}")
            raise

    async def update_student_profile(self, student_id: str, data: Dict[str, Any]) -> None:
        """Update a student profile."""
        try:
            student_ref = self.db.collection('students').document(student_id)
            
            # Add updated timestamp
            data['updatedAt'] = firestore.SERVER_TIMESTAMP
            
            student_ref.update(data)
            logger.info(f"Successfully updated student profile for ID: {student_id}")
        except Exception as e:
            logger.error(f"Error updating student profile: {e}")
            raise

    async def get_all_students(self) -> List[Dict[str, Any]]:
        """Get all students (for admin purposes)."""
        try:
            students = []
            students_ref = self.db.collection('students')
            student_docs = students_ref.stream()
            
            for doc in student_docs:
                student_data = doc.to_dict()
                student_data['id'] = doc.id
                students.append(student_data)
            
            return students
        except Exception as e:
            logger.error(f"Error getting all students: {e}")
            raise

    async def get_student_interests(self, student_id: str) -> List[Dict[str, Any]]:
        """Get interests for a student."""
        try:
            interests = []
            interests_ref = self.db.collection('students').document(student_id).collection('interests')
            interest_docs = interests_ref.stream()
            
            for doc in interest_docs:
                interest_data = doc.to_dict()
                interest_data['id'] = doc.id
                interests.append(interest_data)
            
            return interests
        except Exception as e:
            logger.error(f"Error getting student interests: {e}")
            raise

    async def add_or_update_student_interest(self, student_id: str, interest_data: Dict[str, Any]) -> str:
        """Add or update a student interest."""
        try:
            # Check if interest already exists
            interests_ref = self.db.collection('students').document(student_id).collection('interests')
            
            # Query for existing interest with same category and interest name
            query = interests_ref.where('category', '==', interest_data['category']).where('interest', '==', interest_data['interest'])
            existing_docs = list(query.stream())
            
            if existing_docs:
                # Update existing interest
                interest_id = existing_docs[0].id
                interest_ref = interests_ref.document(interest_id)
                
                # Add timestamps
                interest_data['updatedAt'] = firestore.SERVER_TIMESTAMP
                
                interest_ref.update(interest_data)
                logger.info(f"Updated interest {interest_id} for student {student_id}")
                return interest_id
            else:
                # Create new interest
                interest_ref = interests_ref.document()
                
                # Add timestamps
                interest_data['createdAt'] = firestore.SERVER_TIMESTAMP
                interest_data['updatedAt'] = firestore.SERVER_TIMESTAMP
                
                interest_ref.set(interest_data)
                logger.info(f"Created interest {interest_ref.id} for student {student_id}")
                return interest_ref.id
        except Exception as e:
            logger.error(f"Error adding/updating student interest: {e}")
            raise

    async def remove_student_interest(self, student_id: str, interest_id: str) -> bool:
        """Remove a student interest."""
        try:
            interest_ref = self.db.collection('students').document(student_id).collection('interests').document(interest_id)
            interest = interest_ref.get()
            
            if not interest.exists:
                logger.warning(f"Interest {interest_id} not found for student {student_id}")
                return False
            
            interest_ref.delete()
            logger.info(f"Removed interest {interest_id} for student {student_id}")
            return True
        except Exception as e:
            logger.error(f"Error removing student interest: {e}")
            raise

    # School-related methods
    async def get_all_schools(self) -> List[Dict[str, Any]]:
        """Get all schools."""
        try:
            schools = []
            schools_ref = self.db.collection('US-Colleges')
            school_docs = schools_ref.stream()
            
            for doc in school_docs:
                school_data = doc.to_dict()
                school_data['id'] = doc.id
                schools.append(school_data)
            
            return schools
        except Exception as e:
            logger.error(f"Error getting all schools: {e}")
            raise

    async def get_school(self, school_id: str) -> Optional[Dict[str, Any]]:
        """Get a school by ID."""
        try:
            school_ref = self.db.collection('US-Colleges').document(school_id)
            school = school_ref.get()
            if school.exists:
                data = school.to_dict()
                data['id'] = school.id
                return data
            logger.warning(f"School not found for ID: {school_id}")
            return None
        except Exception as e:
            logger.error(f"Error getting school: {e}")
            raise

    async def get_college_by_name(self, school_name: str) -> Optional[Dict[str, Any]]:
        """Get a college by name."""
        try:
            # Query for school with matching name
            query = self.db.collection('US-Colleges').where('schoolName', '==', school_name)
            schools = list(query.stream())
            
            if schools:
                school_data = schools[0].to_dict()
                school_data['id'] = schools[0].id
                return school_data
            
            logger.warning(f"College not found with name: {school_name}")
            return None
        except Exception as e:
            logger.error(f"Error getting college by name: {e}")
            raise

    async def get_school_programs(self, school_id: str) -> List[Dict[str, Any]]:
        """Get programs for a school."""
        try:
            programs = []
            programs_ref = self.db.collection('US-Colleges').document(school_id).collection('programs')
            program_docs = programs_ref.stream()
            
            for doc in program_docs:
                program_data = doc.to_dict()
                program_data['id'] = doc.id
                programs.append(program_data)
            
            return programs
        except Exception as e:
            logger.error(f"Error getting school programs: {e}")
            raise

    async def get_school_activities(self, school_id: str) -> List[Dict[str, Any]]:
        """Get activities for a school."""
        try:
            activities = []
            activities_ref = self.db.collection('US-Colleges').document(school_id).collection('activities')
            activity_docs = activities_ref.stream()
            
            for doc in activity_docs:
                activity_data = doc.to_dict()
                activity_data['id'] = doc.id
                activities.append(activity_data)
            
            return activities
        except Exception as e:
            logger.error(f"Error getting school activities: {e}")
            raise

    async def get_school_test_requirements(self, school_id: str) -> List[Dict[str, Any]]:
        """Get test requirements for a school."""
        try:
            requirements = []
            requirements_ref = self.db.collection('US-Colleges').document(school_id).collection('testRequirements')
            requirement_docs = requirements_ref.stream()
            
            for doc in requirement_docs:
                requirement_data = doc.to_dict()
                requirement_data['id'] = doc.id
                requirements.append(requirement_data)
            
            return requirements
        except Exception as e:
            logger.error(f"Error getting school test requirements: {e}")
            raise

    async def get_student_target_schools(self, student_id: str) -> List[Dict[str, Any]]:
        """Get target schools for a student."""
        try:
            target_schools = []
            target_schools_ref = self.db.collection('students').document(student_id).collection('targetSchools')
            target_school_docs = target_schools_ref.stream()
            
            for doc in target_school_docs:
                target_school_data = doc.to_dict()
                target_school_data['id'] = doc.id
                
                # Get school details
                if 'schoolId' in target_school_data:
                    school = await self.get_school(target_school_data['schoolId'])
                    if school:
                        target_school_data['schoolName'] = school.get('schoolName', '')
                        target_school_data['schoolType'] = school.get('schoolType', '')
                        target_school_data['location'] = {
                            'city': school.get('city', ''),
                            'state': school.get('state', '')
                        }
                        target_school_data['acceptanceRate'] = school.get('acceptanceRate', '')
                
                target_schools.append(target_school_data)
            
            return target_schools
        except Exception as e:
            logger.error(f"Error getting student target schools: {e}")
            raise

    async def add_target_school(self, student_id: str, school_id: str, data: Dict[str, Any]) -> str:
        """Add a target school for a student."""
        try:
            target_school_ref = self.db.collection('students').document(student_id).collection('targetSchools').document()
            
            # Add school ID and timestamps
            data['schoolId'] = school_id
            data['createdAt'] = firestore.SERVER_TIMESTAMP
            data['updatedAt'] = firestore.SERVER_TIMESTAMP
            
            target_school_ref.set(data)
            logger.info(f"Added target school {school_id} for student {student_id}")
            return target_school_ref.id
        except Exception as e:
            logger.error(f"Error adding target school: {e}")
            raise

    async def update_target_school(self, target_id: str, data: Dict[str, Any]) -> bool:
        """Update a target school."""
        try:
            # Find the target school document
            query = self.db.collection_group('targetSchools').where(firestore.field_path.FieldPath.document_id(), '==', target_id)
            target_schools = list(query.stream())
            
            if not target_schools:
                logger.warning(f"Target school {target_id} not found")
                return False
            
            # Add updated timestamp
            data['updatedAt'] = firestore.SERVER_TIMESTAMP
            
            # Update the document
            target_schools[0].reference.update(data)
            logger.info(f"Updated target school {target_id}")
            return True
        except Exception as e:
            logger.error(f"Error updating target school: {e}")
            raise

    async def remove_target_school(self, target_id: str) -> bool:
        """Remove a target school."""
        try:
            # Find the target school document
            query = self.db.collection_group('targetSchools').where(firestore.field_path.FieldPath.document_id(), '==', target_id)
            target_schools = list(query.stream())
            
            if not target_schools:
                logger.warning(f"Target school {target_id} not found")
                return False
            
            # Delete the document
            target_schools[0].reference.delete()
            logger.info(f"Removed target school {target_id}")
            return True
        except Exception as e:
            logger.error(f"Error removing target school: {e}")
            raise

    # Create student method
    async def create_student(self, student_data: Dict[str, Any], user_id: str = None) -> str:
        """Create a new student profile."""
        try:
            student_ref = self.db.collection('students').document()
            
            # Add timestamps and user ID if provided
            student_data['createdAt'] = firestore.SERVER_TIMESTAMP
            student_data['updatedAt'] = firestore.SERVER_TIMESTAMP
            
            if user_id:
                student_data['userId'] = user_id
            
            student_ref.set(student_data)
            
            # If user ID is provided, update the user document with the student ID
            if user_id:
                user_ref = self.db.collection('users').document(user_id)
                user_ref.update({
                    'studentId': student_ref.id,
                    'updatedAt': firestore.SERVER_TIMESTAMP
                })
            
            logger.info(f"Created student profile {student_ref.id}")
            return student_ref.id
        except Exception as e:
            logger.error(f"Error creating student profile: {e}")
            raise

    def get_user_profile_sync(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user's profile by ID (synchronous version)."""
        try:
            user_ref = self.db.collection('users').document(user_id)
            user_doc = user_ref.get()
            if not user_doc.exists:
                logger.warning(f"User {user_id} not found")
                return None
            
            user_data = user_doc.to_dict()
            user_data['id'] = user_doc.id
            return user_data
        except Exception as e:
            logger.error(f"Error getting user profile: {e}")
            raise

    def get_all_documents_sync(self, collection: str) -> List[Dict[str, Any]]:
        """Get all documents from a Firestore collection (synchronous version)."""
        try:
            docs = self.db.collection(collection).stream()
            result = []
            for doc in docs:
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                result.append(doc_data)
            return result
        except Exception as e:
            logger.error(f"Error getting documents from {collection}: {e}")
            raise

    def update_user_profile_sync(self, user_id: str, profile_data: Dict[str, Any]) -> None:
        """Update a user profile in Firestore (synchronous version)."""
        try:
            logger.info(f"Updating user profile for {user_id} (sync)")
            
            # Get a reference to the user document
            user_ref = self.db.collection('users').document(user_id)
            
            # Check if the document exists
            user_doc = user_ref.get()
            if not user_doc.exists:
                logger.warning(f"User document {user_id} does not exist, creating it")
                # Create the document with the provided data
                user_ref.set(profile_data)
                return
            
            # If the document exists, update it based on the structure of profile_data
            if 'studentProfile' in profile_data:
                logger.info("Found studentProfile in profile_data, using nested structure")
                
                # Use the provided studentProfile structure directly
                # Process the data to handle Sentinel strings before updating
                sanitized_profile_data = replace_sentinel_strings(profile_data)
                
                # For nested structures, we need to update field by field to handle SERVER_TIMESTAMP correctly
                for key, value in sanitized_profile_data.items():
                    # Handle nested dictionaries separately to avoid Sentinel serialization issues
                    if isinstance(value, dict):
                        for nested_key, nested_value in value.items():
                            field_path = f"{key}.{nested_key}"
                            user_ref.update({field_path: nested_value})
                    else:
                        user_ref.update({key: value})
                
                logger.info("Updated user document with provided studentProfile structure")
            elif 'tasks' in profile_data:
                # This is a task update, preserve the existing studentProfile
                logger.info("Found tasks in profile_data, updating tasks")
                
                # Extract tasks and other top-level fields
                tasks = profile_data.pop('tasks', [])
                
                # First update all non-task fields
                if profile_data:
                    sanitized_data = {}
                    for key, value in profile_data.items():
                        if isinstance(value, str) and "Sentinel" in value:
                            sanitized_data[key] = firestore.SERVER_TIMESTAMP
                        else:
                            sanitized_data[key] = value
                    
                    if sanitized_data:
                        user_ref.update(sanitized_data)
                        logger.info(f"Updated non-task fields: {list(sanitized_data.keys())}")
                
                # Then update tasks separately
                if tasks:
                    # Instead of trying to sanitize the existing tasks, create a completely new array
                    # with clean values to avoid any Sentinel serialization issues
                    clean_tasks = []
                    
                    for task in tasks:
                        # Create a new task dictionary with clean values
                        clean_task = {}
                        for k, v in task.items():
                            # Special handling for timestamp fields
                            if k in ['createdAt', 'updatedAt']:
                                # Always use a fresh SERVER_TIMESTAMP for these fields
                                clean_task[k] = firestore.SERVER_TIMESTAMP
                            else:
                                # Copy other fields as is
                                clean_task[k] = v
                        
                        clean_tasks.append(clean_task)
                    
                    # Update tasks field with completely clean tasks
                    logger.info(f"Updating tasks array with {len(clean_tasks)} clean tasks")
                    
                    # Use a direct update without any further processing
                    user_ref.update({"tasks": clean_tasks})
                    logger.info(f"Successfully updated tasks array")
                
                logger.info("Updated user document with tasks and other fields")
            else:
                # This is a simple update, just update the fields provided
                logger.info("Simple update, updating fields directly")
                
                # Process the data to handle Sentinel strings before updating
                sanitized_data = replace_sentinel_strings(profile_data)
                user_ref.update(sanitized_data)
                
                logger.info(f"Updated user document with fields: {list(sanitized_data.keys())}")
        except Exception as e:
            logger.error(f"Error updating user profile: {e}")
            logger.error(f"Error details: {traceback.format_exc()}")
            raise
