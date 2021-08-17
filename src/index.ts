import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import {
  ICompletionManager,
  CompletionConnector,
  ContextConnector,
} from "@jupyterlab/completer";

import { INotebookTracker, NotebookPanel } from "@jupyterlab/notebook";

import { Session } from "@jupyterlab/services";

import { IEditorTracker } from "@jupyterlab/fileeditor";

import { find, toArray } from "@lumino/algorithm";

import MergeConnector from "./MergeConnector";

import TabnineConnector from "./TabnineConnector";

import { COMPLETION_CHARS } from "./consts";

import addKeyupHandler, {
  IEditorWithCodeMirrorEditor,
} from "./editor/addKeyupHandler";

namespace CommandIDs {
  export const invoke = "completer:invoke";

  export const invokeConsole = "completer:invoke-console";

  export const invokeNotebook = "completer:invoke-notebook";

  export const invokeFile = "completer:invoke-file";

  export const select = "completer:select";

  export const selectConsole = "completer:select-console";

  export const selectNotebook = "completer:select-notebook";

  export const selectFile = "completer:select-file";
}

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

        const options = { session, editor };
        const connector = new CompletionConnector({ session, editor });

        const handler = completionManager.register({
          connector,
          editor,
          parent: panel,
        });

        const updateConnector = () => {
          editor = panel.content.activeCell?.editor ?? null;
          options.session = panel.sessionContext.session;
          // TODO consider chainging session.path to "test.py"
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

const files: JupyterFrontEndPlugin<void> = {
  id: "@tabnine/jupyterlab:files",
  requires: [ICompletionManager, IEditorTracker],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    manager: ICompletionManager,
    editorTracker: IEditorTracker
  ): void => {
    const activeSessions: {
      [id: string]: Session.ISessionConnection;
    } = {};

    editorTracker.widgetAdded.connect((sender, widget) => {
      const sessions = app.serviceManager.sessions;
      const editor = widget.content.editor;

      const connector = new ContextConnector({ editor });
      const tabnine = new TabnineConnector({ editor });
      const contextConnector = new MergeConnector(tabnine, connector);

      const handler = manager.register({
        connector: contextConnector,
        editor,
        parent: widget,
      });

      addKeyupHandler(
        editor as unknown as IEditorWithCodeMirrorEditor,
        (editor, event) => {
          if (COMPLETION_CHARS.includes(event.key))
            app.commands.execute(CommandIDs.invoke, { id: widget.id });
          return false;
        }
      );

      const onRunningChanged = (
        sender: Session.IManager,
        models: Session.IModel[]
      ) => {
        const oldSession = activeSessions[widget.id];
        const model = find(models, (m) => m.path === widget.context.path);
        if (model) {
          if (oldSession && oldSession.id === model.id) {
            return;
          }

          if (oldSession) {
            delete activeSessions[widget.id];
            oldSession.dispose();
          }
          const session = sessions.connectTo({ model });
          const options = { editor, session };

          const tabnine = new TabnineConnector(options);
          const connector = new CompletionConnector(options);
          handler.connector = new MergeConnector(tabnine, connector);

          activeSessions[widget.id] = session;
        } else {
          // If we didn't find a match, make sure
          // the connector is the contextConnector and
          // dispose of any previous connection.
          handler.connector = contextConnector;
          if (oldSession) {
            delete activeSessions[widget.id];
            oldSession.dispose();
          }
        }
      };
      onRunningChanged(sessions, toArray(sessions.running()));
      sessions.runningChanged.connect(onRunningChanged);

      // When the widget is disposed, do some cleanup.
      widget.disposed.connect(() => {
        sessions.runningChanged.disconnect(onRunningChanged);
        const session = activeSessions[widget.id];
        if (session) {
          delete activeSessions[widget.id];
          session.dispose();
        }
      });
    });

    app.commands.addCommand(CommandIDs.invokeFile, {
      execute: () => {
        const id =
          editorTracker.currentWidget && editorTracker.currentWidget.id;

        if (id) {
          return app.commands.execute(CommandIDs.invoke, { id });
        }
      },
    });

    app.commands.addCommand(CommandIDs.selectFile, {
      execute: () => {
        const id =
          editorTracker.currentWidget && editorTracker.currentWidget.id;

        if (id) {
          return app.commands.execute(CommandIDs.select, { id });
        }
      },
    });

    // Set enter key for console completer select command.
    app.commands.addKeyBinding({
      command: CommandIDs.selectFile,
      keys: ["Enter"],
      selector: `.jp-FileEditor .jp-mod-completer-active`,
    });
  },
};

const plugins: JupyterFrontEndPlugin<any>[] = [notebooks, files];

export default plugins;
