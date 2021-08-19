import { Widget } from "@lumino/widgets";
import { IStatusBar } from "@jupyterlab/statusbar";
import postConfiguration from "../binary/postConfiguration";
import { TABNINE_LOGO_SVG, TABNINE_LOGO_PRO_SVG } from "../consts";
import pollState from "./pollState";

const statusBarWidget = new Widget();
statusBarWidget.node.style.cursor = "pointer";
statusBarWidget.node.onclick = () => void postConfiguration({ quiet: false });

pollState((state) => {
  let logo = TABNINE_LOGO_SVG;
  if (state.service_level === "Pro") logo = TABNINE_LOGO_PRO_SVG;

  statusBarWidget.node.innerHTML = `<div style="display:flex;height:100%;align-items:center">${logo}</div>`;
});

export default function registerStatusBarWidget(statusBar: IStatusBar) {
  statusBar.registerStatusItem("tabnine", {
    align: "right",
    item: statusBarWidget,
  });
}
