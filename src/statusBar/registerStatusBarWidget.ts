import { Widget } from "@lumino/widgets";
import { IStatusBar } from "@jupyterlab/statusbar";
import postConfiguration from "../binary/postConfiguration";
import { TABNINE_LOGO } from "../consts";

const statusBarWidget = new Widget();
statusBarWidget.node.textContent = "tabnine";
statusBarWidget.node.style.cursor = "pointer";
statusBarWidget.node.innerText = `${TABNINE_LOGO} tabnine`;
statusBarWidget.node.onclick = () => void postConfiguration({ quiet: false });

export default function registerStatusBarWidget(statusBar: IStatusBar) {
  statusBar.registerStatusItem("tabnine", {
    align: "right",
    item: statusBarWidget,
  });
}
