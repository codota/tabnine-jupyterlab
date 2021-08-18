// @ts-ignore
import CodeMirror from "codemirror";
import { CodeEditor } from "@jupyterlab/codeeditor";

export type IEditorWithCodeMirrorEditor = {
  editor: CodeEditor.IEditor;
};

// A hack based on https://github.com/jupyterlab/jupyterlab/blob/bac24a158a6ba887996edac12796da9c2009c0f9/packages/codemirror/src/editor.ts#L155
export default function addKeyupHandler(
  editor: IEditorWithCodeMirrorEditor,
  handler: (editor: CodeEditor.IEditor, event: KeyboardEvent) => boolean
) {
  CodeMirror.on(editor.editor, "keyup", handler);
}
