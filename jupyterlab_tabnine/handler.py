import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado

from .tabnine import Tabnine


class TabnineHandler(APIHandler):
    def initialize(self, tabnine):
        self.tabnine = tabnine

    @tornado.web.authenticated
    def post(self):
        request = self.request.body.decode("utf-8")
        response = self.tabnine.request(request)
        self.finish(json.dumps(response))


def setup_handler(web_app):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    route_pattern = url_path_join(base_url, "tabnine")
    tabnine = Tabnine()
    handlers = [(route_pattern, TabnineHandler, {"tabnine": tabnine})]
    web_app.add_handlers(host_pattern, handlers)
