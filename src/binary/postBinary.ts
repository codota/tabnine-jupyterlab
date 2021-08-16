import { URLExt } from "@jupyterlab/coreutils";

import { ServerConnection } from "@jupyterlab/services";

const settings = ServerConnection.makeSettings();

const requestUrl = URLExt.join(settings.baseUrl, "tabnine");

export default async function postBinary<TRequest, TResponse>(
  request: TRequest
): Promise<TResponse> {
  let response: Response;
  try {
    response = await ServerConnection.makeRequest(
      requestUrl,
      { method: "POST", body: JSON.stringify({ request, version: "3.2.71" }) },
      settings
    );
  } catch (error) {
    throw new ServerConnection.NetworkError(error);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message);
  }

  return data;
}
