def convert_timestamps_to_str(obj):
    """Convert Firestore timestamps to string format recursively."""
    if isinstance(obj, dict):
        return {k: convert_timestamps_to_str(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_timestamps_to_str(v) for v in obj]
    elif str(type(obj)) == "<class 'google.cloud.firestore_v1.types.document.DocumentSnapshot'>":
        return obj.to_dict()
    elif str(type(obj)) == "<class 'google.api_core.datetime_helpers.DatetimeWithNanoseconds'>":
        return obj.isoformat()
    return obj