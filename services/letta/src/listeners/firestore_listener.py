from ..config.firebase_config import firebase_config
from ..orchestrator.letta_orchestrator import LettaOrchestrator

# Create a global orchestrator instance
orchestrator = LettaOrchestrator()

def on_user_profile_update(doc_snapshot, changes, read_time):
    """
    Callback function triggered when a user profile is updated in Firestore.
    
    Args:
        doc_snapshot: The updated document snapshot
        changes: The changes that occurred
        read_time: The time at which the changes were read
    """
    for doc in doc_snapshot:
        user_data = doc.to_dict()
        user_id = doc.id
        
        print(f"Profile update detected for user {user_id}")
        
        # Process the profile update with the Letta orchestrator
        orchestrator.process_profile_update(user_id, user_data)

def start_firestore_listeners():
    """Start all Firestore listeners for monitoring changes."""
    # Get Firestore client
    db = firebase_config.firestore_client
    
    # Create a listener for user profiles collection
    users_ref = db.collection('users')
    
    # Watch for changes in user documents
    user_watch = users_ref.on_snapshot(on_user_profile_update)
    
    print("Firestore listeners started successfully")
    
    # Return the watch objects so they can be stopped if needed
    return {
        "user_watch": user_watch
    }