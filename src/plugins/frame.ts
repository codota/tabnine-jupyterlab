import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import { IStatusBar } from "@jupyterlab/statusbar";

import registerStatusBarWidget from "../statusBar/registerStatusBarWidget";

const frame: JupyterFrontEndPlugin<void> = {
  id: "@tabnine/jupyterlab:frame",
  autoStart: true,
  requires: [IStatusBar],
  activate: async (app: JupyterFrontEnd, statusBar: IStatusBar) => {
    registerStatusBarWidget(statusBar);
  },
};

export default frame;
