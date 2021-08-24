import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import { IStatusBar } from "@jupyterlab/statusbar";

import registerHubWidget from "../statusBar/registerHubWidget";
import registerUpdateWidget from "../statusBar/registerUpdateWidget";

const frame: JupyterFrontEndPlugin<void> = {
  id: "@tabnine/jupyterlab:frame",
  autoStart: true,
  requires: [IStatusBar],
  activate: async (app: JupyterFrontEnd, statusBar: IStatusBar) => {
    registerUpdateWidget(statusBar);
    registerHubWidget(statusBar, app);
  },
};

export default frame;
