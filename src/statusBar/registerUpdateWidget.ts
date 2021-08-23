import { Widget } from "@lumino/widgets";
import { IStatusBar } from "@jupyterlab/statusbar";
import getLatestVersion from "./getLatestVersion";
import { showDialog } from "@jupyterlab/apputils";
import { parse as parseSemver } from "semver";
import { version } from "../../package.json";

const updateWidget = new Widget();
updateWidget.node.style.cursor = "pointer";
updateWidget.node.onclick = showUpdateDialog;

const updateDialog = new Widget();
updateDialog.node.innerHTML = `<div> <div>To update to the latest Tabnine version, run:</div><div style="margin:10px 0; padding-left: 5px;"><code style="text-align:center;">pip install --upgrade jupyterlab_tabnine</code></div><div>in your terminal, and restart JupyterLab</div></div>`;

function showUpdateDialog() {
  showDialog({
    title: "Tabnine Update",
    body: updateDialog,
  });
}

export default function registerUpdateWidget(statusBar: IStatusBar) {
  getLatestVersion().then((latestVersion) => {
    const currentVersion = parseSemver(version);
    if (latestVersion.compare(currentVersion) > 0) {
      updateWidget.node.innerHTML = `<div style="font-weight:bold;display:flex;height:100%;align-items:center;">Tabnine v${latestVersion} is available!</div>`;
      statusBar.registerStatusItem("tabnine-update", {
        align: "left",
        item: updateWidget,
      });
    }
  });
}
