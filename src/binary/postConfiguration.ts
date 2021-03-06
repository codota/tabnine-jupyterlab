import postBinary from "./postBinary";

export type ConfigurationResult = {
  message: string;
};

export type ConfigurationParams = {
  quiet: boolean;
};

export default async function postConfiguration(
  params: ConfigurationParams
): Promise<ConfigurationResult> {
  return postBinary<
    { Configuration: ConfigurationParams },
    ConfigurationResult
  >({
    Configuration: params,
  });
}
