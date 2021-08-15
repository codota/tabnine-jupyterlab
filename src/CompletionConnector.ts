import { DataConnector } from "@jupyterlab/statedb";
import { CompletionHandler } from "@jupyterlab/completer";

export default class CompletionConnector extends DataConnector<
  CompletionHandler.IReply,
  void,
  CompletionHandler.IRequest
> {
  constructor(
    connectors: DataConnector<
      CompletionHandler.IReply,
      void,
      CompletionHandler.IRequest
    >[]
  ) {
    super();
    this._connectors = connectors;
  }

  fetch(
    request: CompletionHandler.IRequest
  ): Promise<CompletionHandler.IReply> {
    return Promise.all(
      this._connectors.map((connector) => connector.fetch(request))
    ).then((replies) => {
      const definedReplies = replies.filter(
        (reply): reply is CompletionHandler.IReply => !!reply
      );
      return mergeReplies(definedReplies);
    });
  }

  private _connectors: DataConnector<
    CompletionHandler.IReply,
    void,
    CompletionHandler.IRequest
  >[];
}

function mergeReplies(
  replies: Array<CompletionHandler.IReply>
): CompletionHandler.IReply {
  const repliesWithMatches = replies.filter((rep) => rep.matches.length > 0);
  if (repliesWithMatches.length === 0) {
    return replies[0];
  }
  if (repliesWithMatches.length === 1) {
    return repliesWithMatches[0];
  }

  const matches: Set<string> = new Set();
  repliesWithMatches.forEach((reply) => {
    reply.matches.forEach((match) => matches.add(match));
  });

  return { ...repliesWithMatches[0], matches: [...matches] };
}
