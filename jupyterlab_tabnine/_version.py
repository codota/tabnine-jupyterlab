import json
from pathlib import Path

LAB_EXTENSION_PATH = Path(__file__).parent / "labextension"

__version__ = "Unknown"
try:
    __version__ = json.loads(
        (LAB_EXTENSION_PATH / "package.json").read_text(encoding="utf-8")
    )["version"]
except:
    pass
