from datetime import datetime

def parse_deadline(deadline_str: str, year: int = None) -> datetime:
    """Parse deadline string into a datetime object, supporting multiple formats."""
    if not deadline_str:
        raise ValueError("Deadline string is empty or None")

    try:
        # First try YYYY-MM-DD format (e.g., "2025-03-15")
        try:
            return datetime.strptime(deadline_str, "%Y-%m-%d")
        except ValueError:
            pass

        # Then try MM-DD-YYYY format (e.g., "12-02-2025")
        try:
            return datetime.strptime(deadline_str, "%m-%d-%Y")
        except ValueError:
            pass

        # Finally try MM/DD format (e.g., "11/18")
        if '/' in deadline_str and len(deadline_str.split('/')) == 2:
            month, day = map(int, deadline_str.split('/'))
            if year is None:
                year = datetime.now().year
            return datetime(year, month, day)

        raise ValueError(f"Unrecognized date format: {deadline_str}")

    except Exception as e:
        raise ValueError(f"Invalid deadline format: {deadline_str}. Supported formats: 'MM/DD', 'YYYY-MM-DD', 'MM-DD-YYYY'. Error: {e}")

def days_until_deadline(deadline_str: str) -> int:
    """Calculate the number of days until a deadline."""
    if not deadline_str:
        return None
    
    try:
        deadline_date = parse_deadline(deadline_str)
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        delta = deadline_date - today
        return max(0, delta.days)
    except Exception:
        return None