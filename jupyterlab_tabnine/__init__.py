import json
import os.path as osp

from .handler import setup_handler
from ._version import __version__

HERE = osp.abspath(osp.dirname(__file__))

with open(osp.join(HERE, "labextension", "package.json")) as fid:
    data = json.load(fid)


def _jupyter_labextension_paths():
    return [{"src": "labextension", "dest": data["name"]}]


def _jupyter_server_extension_points():
    return [{"module": "jupyterlab_tabnine"}]


def _load_jupyter_server_extension(server_app):
    setup_handler(server_app.web_app)
    server_app.log.info("Registered jupyterlab_tabnine extension at URL path")


# For backward compatibility with the classical notebook
load_jupyter_server_extension = _load_jupyter_server_extension
