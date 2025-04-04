import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth
from pathlib import Path

class FirebaseConfig:
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseConfig, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._initialize_firebase()
            self._initialized = True
    
    def _initialize_firebase(self):
        try:
            # Get service account key path from environment or use default
            service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH', 
                                           './src/config/serviceAccountKey.json')
            
            # Check if path exists
            if not Path(service_account_path).exists():
                # Try to load from environment variable as JSON string
                service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
                if service_account_json:
                    service_account = json.loads(service_account_json)
                    cred = credentials.Certificate(service_account)
                else:
                    raise FileNotFoundError(f"Service account key not found at: {service_account_path}")
            else:
                cred = credentials.Certificate(service_account_path)
            
            # Initialize Firebase app
            self.app = firebase_admin.initialize_app(cred)
            self.db = firestore.client()
            # Remove the settings call as it's not available in the current Firebase Admin SDK
            print("Firebase initialized successfully")
            
        except Exception as e:
            print(f"Error initializing Firebase: {e}")
            raise
    
    @property
    def firestore_client(self):
        return self.db
    
    @property
    def auth_client(self):
        return auth

# Initialize Firebase and get Firestore client
firebase_config = FirebaseConfig()
db = firebase_config.firestore_client