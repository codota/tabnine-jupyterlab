import { CodeEditor } from "@jupyterlab/codeeditor";
import { CompletionHandler } from "@jupyterlab/completer";
import { CHAR_LIMIT } from "../consts";
import postAutocomplete from "../binary/postAutocomplete";
import { DataConnector } from "@jupyterlab/statedb";
import icon from "../icon";
import { MAX_RESULTS } from "../consts";

type IOptions = {
  editor: CodeEditor.IEditor | null;
  path: string;
};

type IAutoCompleteRequestOptions = {
  editor: CodeEditor.IEditor;
  path: string;
  text: string;
};

export default class TabnineConnector
  extends DataConnector<
    CompletionHandler.ICompletionItemsReply,
    void,
    CompletionHandler.IRequest
  >
  implements CompletionHandler.ICompletionItemsConnector
{
  responseType = "ICompletionItemsReply" as const; // TODO what's this?
  _path: string;

  constructor(options: IOptions) {
    super();
    this._editor = options.editor;
    this._path = options.path;
  }

  fetch(
    request: CompletionHandler.IRequest
  ): Promise<CompletionHandler.ICompletionItemsReply> {
    return autoComplete({
      editor: this._editor,
      text: request.text,
      path: this._path,
    });
  }

  private _editor: CodeEditor.IEditor | null;
}

export async function autoComplete({
  editor,
  text,
  path: filename,
}: IAutoCompleteRequestOptions): Promise<CompletionHandler.ICompletionItemsReply> {
  const position = editor.getCursorPosition();
  const currentOffset = editor.getOffsetAt(position);

  const beforeStartOffset = Math.max(0, currentOffset - CHAR_LIMIT);
  const afterEndOffset = currentOffset + CHAR_LIMIT;

  const before = text.slice(beforeStartOffset, currentOffset);
  const after = text.slice(currentOffset, afterEndOffset);

  const response = await postAutocomplete({
    before,
    after,
    max_num_results: MAX_RESULTS,
    filename,
    region_includes_beginning: currentOffset === 0,
    region_includes_end: false,
  });

  const items: CompletionHandler.ICompletionItems = response.results.map(
    (response) => ({
      label: response.new_prefix,
      type: "tabnine",
      icon,
    })
  );

  return {
    start: currentOffset - response.old_prefix.length,
    end: currentOffset,
    items,
  };
}
