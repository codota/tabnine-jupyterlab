import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import { ICompletionManager, CompletionConnector } from "@jupyterlab/completer";

import { INotebookTracker, NotebookPanel } from "@jupyterlab/notebook";

import { COMPLETION_CHARS } from "../consts";

import addKeyupHandler, {
  IEditorWithCodeMirrorEditor,
} from "../editor/addKeyupHandler";

import * as CommandIDs from "../commands";

import MergeConnector from "../connectors/MergeConnector";

import TabnineConnector from "../connectors/TabnineConnector";

import { dummyFilenameByCellType } from "../utils/notebook.utils";

const notebooks: JupyterFrontEndPlugin<void> = {
  id: "@tabnine/jupyterlab:notebook",
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
        const { session } = panel.sessionContext;

        const options = {
          session,
          editor,
          path: dummyFilenameByCellType(panel.content.activeCell),
        };
        const connector = new CompletionConnector({ session, editor });

        const handler = completionManager.register({
          connector,
          editor,
          parent: panel,
        });

        const updateConnector = () => {
          editor = panel.content.activeCell?.editor ?? null;
          options.session = panel.sessionContext.session;
          options.path = dummyFilenameByCellType(panel.content.activeCell);
          options.editor = editor;
          handler.editor = editor;

          addKeyupHandler(
            editor as unknown as IEditorWithCodeMirrorEditor,
            (editor, event) => {
              if (COMPLETION_CHARS.includes(event.key))
                app.commands.execute(CommandIDs.invoke, { id: panel.id });
              return false;
            }
          );

          const tabnine = new TabnineConnector(options);
          const connector = new CompletionConnector(options);

          handler.connector = new MergeConnector(tabnine, connector);
        };

        panel.content.activeCellChanged.connect(updateConnector);
        panel.sessionContext.sessionChanged.connect(updateConnector);
      }
    );

    app.commands.addCommand(CommandIDs.invokeNotebook, {
      execute: () => {
        const panel = notebooks.currentWidget;
        if (panel && panel.content.activeCell?.model.type === "code") {
          return app.commands.execute(CommandIDs.invoke, { id: panel.id });
        }
      },
    });

    app.commands.addCommand(CommandIDs.selectNotebook, {
      execute: () => {
        const id = notebooks.currentWidget && notebooks.currentWidget.id;

        if (id) {
          return app.commands.execute(CommandIDs.select, { id });
        }
      },
    });

    app.commands.addKeyBinding({
      command: CommandIDs.selectNotebook,
      keys: ["Enter"],
      selector: ".jp-Notebook .jp-mod-completer-active",
    });
  },
};

export default notebooks;
