import { CodeEditor } from "@jupyterlab/codeeditor";
import { DataConnector } from "@jupyterlab/statedb";
import { CompletionHandler } from "@jupyterlab/completer";
import postAutocomplete from "./binary/postAutocomplete";
import { CHAR_LIMIT } from "./consts";

type IOptions = {
  editor: CodeEditor.IEditor | null;
};

export default class TabnineConnector extends DataConnector<
  CompletionHandler.IReply,
  void,
  CompletionHandler.IRequest
> {
  constructor(options: IOptions) {
    super();
    this._editor = options.editor;
  }

  fetch(
    request: CompletionHandler.IRequest
  ): Promise<CompletionHandler.IReply> {
    if (!this._editor) {
      return Promise.reject("No editor");
    }

    return autoComplete(this._editor);
  }

  private _editor: CodeEditor.IEditor | null;
}

export async function autoComplete(
  editor: CodeEditor.IEditor
): Promise<CompletionHandler.IReply> {
  // Find the token at the cursor
  const position = editor.getCursorPosition();
  const currentOffset = editor.getOffsetAt(position);

  const beforeStartOffset = Math.max(0, currentOffset - CHAR_LIMIT);
  const afterEndOffset = currentOffset + CHAR_LIMIT;

  const before = editor
    .getTokens()
    .filter(({ offset }) => beforeStartOffset <= offset)
    .map(({ value }) => value)
    .join("");

  const after = editor
    .getTokens()
    .filter(({ offset }) => offset > currentOffset && offset < afterEndOffset)
    .map(({ value }) => value)
    .join("");

  const response = await postAutocomplete({
    before,
    after,
    max_num_results: 5,
    filename: "bilu",
    region_includes_end: true,
    region_includes_beginning: true,
  });

  debugger;
  return {
    start: currentOffset,
    end: currentOffset + 10,
    matches: response.results.map(({ new_prefix }) => new_prefix),
    metadata: {},
  };
}
