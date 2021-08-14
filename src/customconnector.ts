import { CodeEditor } from "@jupyterlab/codeeditor";
import { DataConnector } from "@jupyterlab/statedb";
import { CompletionHandler } from "@jupyterlab/completer";
import postAutocomplete  from './binary/postAutocomplete';

export class CustomConnector extends DataConnector<
  CompletionHandler.IReply,
  void,
  CompletionHandler.IRequest
> {

  constructor(options: CustomConnector.IOptions) {
    super();
    this._editor = options.editor;
  }
    
  fetch(
    request: CompletionHandler.IRequest
  ): Promise<CompletionHandler.IReply> {
    if (!this._editor) {
      return Promise.reject("No editor");
    }
    return new Promise<CompletionHandler.IReply>((resolve) => {
      resolve(Private.completionHint(this._editor));
    });
  }

  private _editor: CodeEditor.IEditor | null;
}

/**
 * A namespace for custom connector statics.
 */
export namespace CustomConnector {
  /**
   * The instantiation options for cell completion handlers.
   */
  export interface IOptions {
    /**
     * The session used by the custom connector.
     */
    editor: CodeEditor.IEditor | null;
  }
}

// i
/**
 * A namespace for Private functionality.
 */
namespace Private {
  /**
   * Get a list of mocked completion hints.
   *
   * @param editor Editor
   * @returns Completion reply
   */
  export function completionHint(
    editor: CodeEditor.IEditor
  ): CompletionHandler.IReply {
    // Find the token at the cursor
    const cursor = editor.getCursorPosition();
    const token = editor.getTokenForPosition(cursor);
    const tokenList = [
      { value: token.value + "Dima", offset: token.offset, type: "magic" },
    ];

    postAutocomplete({before: "A", "after": "B", max_num_results: 5, filename: "bilu", region_includes_end: true, region_includes_beginning: true });
    // Only choose the ones that have a non-empty type field, which are likely to be of interest.
    const completionList = tokenList.filter((t) => t.type).map((t) => t.value);
    // Remove duplicate completions from the list
    const matches = Array.from(new Set<string>(completionList));

    return {
      start: token.offset,
      end: token.offset + token.value.length,
      matches,
      metadata: {},
    };
  }
}
