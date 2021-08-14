import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
from tornado.web import StaticFileHandler


class TabnineHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        print(input_data)
        data = {"greetings": "Hello"}
        self.finish(json.dumps(data))


def setup_handler(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    route_pattern = url_path_join(base_url, "tabnine", "request")
    handlers = [(route_pattern, TabnineHandler)]
    web_app.add_handlers(host_pattern, handlers)
