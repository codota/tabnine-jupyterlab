import { DataConnector } from "@jupyterlab/statedb";
import { CompletionHandler } from "@jupyterlab/completer";

export default class MergeConnector
  extends DataConnector<
    CompletionHandler.ICompletionItemsReply,
    void,
    CompletionHandler.IRequest
  >
  implements CompletionHandler.ICompletionItemsConnector
{
  responseType = "ICompletionItemsReply" as const; // TODO what's this?

  completionItemsConnector: CompletionHandler.ICompletionItemsConnector;

  dataConnector: DataConnector<
    CompletionHandler.IReply,
    void,
    CompletionHandler.IRequest
  >;

  constructor(
    completionItemsConnector: CompletionHandler.ICompletionItemsConnector,
    dataConnector: DataConnector<
      CompletionHandler.IReply,
      void,
      CompletionHandler.IRequest
    >
  ) {
    super();
    this.completionItemsConnector = completionItemsConnector;
    this.dataConnector = dataConnector;
  }

  fetch(
    request: CompletionHandler.IRequest
  ): Promise<CompletionHandler.ICompletionItemsReply> {
    return Promise.all([
      this.completionItemsConnector.fetch(request),
      this.dataConnector.fetch(request),
    ]).then(([replyWithItems, replyWithMatches]) => {
      return mergeReplies(replyWithItems, replyWithMatches);
    });
  }
}

export function mergeReplies(
  replyWithItems: CompletionHandler.ICompletionItemsReply,
  replyWithMatches: CompletionHandler.IReply
): CompletionHandler.ICompletionItemsReply {
  const { start } = replyWithItems;
  const { end } = replyWithItems;
  const items: CompletionHandler.ICompletionItem[] = [];
  replyWithItems.items.forEach((item) => items.push(item));

  const replyWithMatchesMetaData = replyWithMatches.metadata
    ._jupyter_types_experimental as Array<{ type: string }>;

  replyWithMatches.matches.forEach((label, index) =>
    items.push({
      label,
      type: replyWithMatchesMetaData
        ? replyWithMatchesMetaData[index].type
        : "",
    })
  );

  return { start, items, end };
}
