import { Widget } from "@lumino/widgets";
import { MainAreaWidget } from "@jupyterlab/apputils";
import { IStatusBar } from "@jupyterlab/statusbar";
import { JupyterFrontEnd } from "@jupyterlab/application";
import postConfiguration from "../binary/postConfiguration";
import { TABNINE_LOGO_SVG, TABNINE_LOGO_PRO_SVG } from "../consts";
import pollState from "./pollState";

const hubStatusBarWidget = new Widget();
hubStatusBarWidget.node.style.cursor = "pointer";

pollState((state) => {
  let logo = TABNINE_LOGO_SVG;
  if (state?.service_level === "Pro" || state?.service_level === "Trial")
    logo = TABNINE_LOGO_PRO_SVG;

  hubStatusBarWidget.node.innerHTML = `<div style="display:flex;height:100%;align-items:center">${logo}</div>`;
});

let unique = 0;

async function openHub(app: JupyterFrontEnd) {
  const hubContentWidget = new Widget();
  const hubMainWidget = new MainAreaWidget({ content: hubContentWidget });
  hubMainWidget.id = `@tabnine/jupyterlab:hub-${unique++}`;
  hubMainWidget.title.label = "Tabnine Hub";
  hubMainWidget.title.closable = true;

  const { message: url } = await postConfiguration({ quiet: true });
  hubContentWidget.node.innerHTML = `<iframe height="100%" width="100%" src="${url}"></iframe>`;

  app.shell.add(hubMainWidget, "main");
}

export default function registerHubWidget(
  statusBar: IStatusBar,
  app: JupyterFrontEnd
) {
  hubStatusBarWidget.node.onclick = () => openHub(app);
  statusBar.registerStatusItem("tabnine", {
    align: "left",
    item: hubStatusBarWidget,
  });
}
