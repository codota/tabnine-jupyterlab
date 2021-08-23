import { Widget } from "@lumino/widgets";
import { IStatusBar } from "@jupyterlab/statusbar";
import postConfiguration from "../binary/postConfiguration";
import { TABNINE_LOGO_SVG, TABNINE_LOGO_PRO_SVG } from "../consts";
import pollState from "./pollState";

const hubWidget = new Widget();
hubWidget.node.style.cursor = "pointer";
hubWidget.node.onclick = () => void postConfiguration({ quiet: false });

pollState((state) => {
  let logo = TABNINE_LOGO_SVG;
  if (state?.service_level === "Pro" || state?.service_level === "Trial")
    logo = TABNINE_LOGO_PRO_SVG;

  hubWidget.node.innerHTML = `<div style="display:flex;height:100%;align-items:center">${logo}</div>`;
});

export default function registerHubWidget(statusBar: IStatusBar) {
  statusBar.registerStatusItem("tabnine", {
    align: "left",
    item: hubWidget,
  });
}
