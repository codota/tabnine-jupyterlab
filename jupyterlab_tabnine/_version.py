import json
from pathlib import Path

LAB_EXTENSION_PATH = Path(__file__).parent / "labextensions"
MAIN_PACKAGE_PATH = LAB_EXTENSION_PATH / "@tabnine" / "jupyterlab"

__version__ = "Unknown"
try:
    __version__ = json.loads(
        (MAIN_PACKAGE_PATH / "package.json").read_text(encoding="utf-8")
    )["version"]
except:
    pass
