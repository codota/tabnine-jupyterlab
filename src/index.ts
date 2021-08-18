import { JupyterFrontEndPlugin } from "@jupyterlab/application";

import notebooks from "./plugins/notebooks";
import files from "./plugins/files";
import frame from "./plugins/frame";

const plugins: JupyterFrontEndPlugin<any>[] = [notebooks, files, frame];

export default plugins;
