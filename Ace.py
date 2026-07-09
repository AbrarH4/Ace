"""Ace — AI-powered study assistant.

Entry point for the application. Instantiates and starts the main
CustomTkinter UI loop.
"""

import sys
from pathlib import Path

# Ensure the scripts package directory is importable whether run from repo root
# or a packaged build.
_SCRIPTS_DIR = Path(__file__).resolve().parent / "scripts"
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))

from UI import ACEUI

if __name__ == "__main__":
    app = ACEUI()
    app.mainloop()
