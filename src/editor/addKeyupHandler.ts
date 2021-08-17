// @ts-ignore
import CodeMirror from "codemirror";
import { CodeEditor } from "@jupyterlab/codeeditor";

export type IEditorWithCodeMirrorEditor = {
  editor: CodeEditor.IEditor;
};

export default function addKeyupHandler(
  editor: IEditorWithCodeMirrorEditor,
  handler: (editor: CodeEditor.IEditor, event: KeyboardEvent) => boolean
) {
  CodeMirror.on(editor.editor, "keyup", handler);
}
