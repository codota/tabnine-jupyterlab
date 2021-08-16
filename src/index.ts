import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import { ICompletionManager, CompletionConnector } from "@jupyterlab/completer";

import { INotebookTracker, NotebookPanel } from "@jupyterlab/notebook";

import MergeConnector from "./MergeConnector";

import TabnineConnector from "./TabnineConnector";

import { COMPLETION_CHARS } from "./consts";

namespace CommandIDs {
  export const invoke = "completer:invoke";

  export const invokeNotebook = "completer:invoke-notebook";

  export const select = "completer:select";

  export const selectNotebook = "completer:select-notebook";
}

const extension: JupyterFrontEndPlugin<void> = {
  id: "tabnine",
  autoStart: true,
  requires: [ICompletionManager, INotebookTracker],
  activate: async (
    app: JupyterFrontEnd,
    completionManager: ICompletionManager,
    notebooks: INotebookTracker
  ) => {
    console.log("Tabnine extension is activated!");

    notebooks.widgetAdded.connect(
      (sender: INotebookTracker, panel: NotebookPanel) => {

        let editor = panel.content.activeCell?.editor ?? null;
        const session = panel.sessionContext.session;

        const options = { session, editor };

        const connector = new CompletionConnector({ session, editor });

        const handler = completionManager.register({
          connector,
          editor,
          parent: panel,
        });

        function updateConnector() {
          editor = panel.content.activeCell?.editor ?? null;
          options.session = panel.sessionContext.session;
          options.editor = editor;
          handler.editor = editor;

          panel.content.activeCell?.editor.addKeydownHandler((editor, event) => {
            if (COMPLETION_CHARS.includes(event.key))
              app.commands.execute(CommandIDs.invoke, { id: panel.id });
            return false;
          });

          const tabnine = new TabnineConnector(options);
          const connector = new CompletionConnector(options);

          handler.connector = new MergeConnector(tabnine, connector);
        }

        panel.content.activeCellChanged.connect(updateConnector);
        panel.sessionContext.sessionChanged.connect(updateConnector);
      }
    );

    // Add notebook completer command.
    app.commands.addCommand(CommandIDs.invokeNotebook, {
      execute: () => {
        const panel = notebooks.currentWidget;
        if (panel && panel.content.activeCell?.model.type === "code") {
          return app.commands.execute(CommandIDs.invoke, { id: panel.id });
        }
      },
    });

    // Add notebook completer select command.
    app.commands.addCommand(CommandIDs.selectNotebook, {
      execute: () => {
        const id = notebooks.currentWidget && notebooks.currentWidget.id;

        if (id) {
          return app.commands.execute(CommandIDs.select, { id });
        }
      },
    });

    // Set enter key for notebook completer select command.
    app.commands.addKeyBinding({
      command: CommandIDs.selectNotebook,
      keys: ["Enter"],
      selector: ".jp-Notebook .jp-mod-completer-active",
    });
  },
};

export default extension;
