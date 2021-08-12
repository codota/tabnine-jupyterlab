import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
from tornado.web import StaticFileHandler


class RouteHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        print(input_data)
        data = {"greetings": "Hello"}
        self.finish(json.dumps(data))


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a JupyterHub setting
    route_pattern = url_path_join(base_url, url_path, "complete")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
