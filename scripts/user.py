import json
from backend.routes.config import SETTINGS_FILE


def get_user_name():
    """Returns the stored user name or None if not set."""
    try:
        with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            name = data.get("user_name", "").strip()
            return name if name else None
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def save_user_name(name):
    """Saves the user name to settings.json without overwriting other keys."""
    try:
        with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {}

    data["user_name"] = name.strip()

    with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
