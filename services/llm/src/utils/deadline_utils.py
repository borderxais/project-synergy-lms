from datetime import datetime


def days_until_deadline(deadline_str: str) -> int:
    """Calculate the number of days until a given deadline."""
    if not deadline_str:
        return float('inf')  # Return a large number if no deadline is provided

    try:
        # Try parsing 'MM/DD' format
        month, day = map(int, deadline_str.split('/'))
        deadline_date = datetime(datetime.now().year, month, day)
    except ValueError:
        try:
            # Try parsing 'MM-DD-YYYY' format
            deadline_date = datetime.strptime(deadline_str, "%m-%d-%Y")
        except ValueError as e:
            raise ValueError(f"Invalid deadline format: {deadline_str}. Expected format: 'MM/DD' or 'MM-DD-YYYY'. Error: {e}")

    today = datetime.now()
    return (deadline_date - today).days
