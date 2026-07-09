"""Root launcher entry point — delegates to scripts/Launcher.py."""
import runpy
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "scripts"))

if __name__ == "__main__":
    runpy.run_path(str(ROOT / "scripts" / "Launcher.py"), run_name="__main__")
