import { Widget } from "@lumino/widgets";
import { IStatusBar } from "@jupyterlab/statusbar";
import postConfiguration from "../binary/postConfiguration";
import { TABNINE_LOGO } from "../consts";
import pollState from "./pollState";

const statusBarWidget = new Widget();
statusBarWidget.node.textContent = "tabnine";
statusBarWidget.node.style.cursor = "pointer";
statusBarWidget.node.innerText = `${TABNINE_LOGO} tabnine`;
statusBarWidget.node.onclick = () => void postConfiguration({ quiet: false });

pollState((state) => {
  let level = "";
  if (state.service_level === "Pro") level = " pro";

  statusBarWidget.node.innerText = `${TABNINE_LOGO} tabnine ${level}`;
});

export default function registerStatusBarWidget(statusBar: IStatusBar) {
  statusBar.registerStatusItem("tabnine", {
    align: "right",
    item: statusBarWidget,
  });
}
