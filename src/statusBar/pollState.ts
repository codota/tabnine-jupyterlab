import postState, { StateResult } from "../binary/postState";
import { POLL_STATE_INTERVAL } from "../consts";

export default function (onStatePoll: (state: StateResult) => void): void {
  postState().then(onStatePoll);

  setInterval(() => {
    postState().then(onStatePoll);
  }, POLL_STATE_INTERVAL);
}
