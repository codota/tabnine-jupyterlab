import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import {
  ICompletionManager,
  CompletionConnector,
  ContextConnector,
} from "@jupyterlab/completer";

import { Session } from "@jupyterlab/services";

import { IEditorTracker } from "@jupyterlab/fileeditor";

import { find, toArray } from "@lumino/algorithm";

import MergeConnector from "../connectors/MergeConnector";

import TabnineConnector from "../connectors/TabnineConnector";

import { COMPLETION_CHARS } from "../consts";

import addKeyupHandler, {
  IEditorWithCodeMirrorEditor,
} from "../editor/addKeyupHandler";

import * as CommandIDs from "../commands";

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
      const tabnine = new TabnineConnector({
        editor,
        path: widget.context.path,
      });
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
          const options = { editor, session, path: widget.context.path };

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

export default files;
