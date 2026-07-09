"""Ace — AI-powered study assistant.

Entry point for the application. Instantiates and starts the main
CustomTkinter UI loop.
"""
import sys
from pathlib import Path as _Path
_ROOT = _Path(__file__).resolve().parent.parent
_SCRIPTS = _ROOT / "scripts"
for _p in (str(_ROOT), str(_SCRIPTS)):
    if _p not in sys.path:
        sys.path.insert(0, _p)


from UI import ACEUI

if __name__ == "__main__":
    app = ACEUI()
    app.mainloop()
