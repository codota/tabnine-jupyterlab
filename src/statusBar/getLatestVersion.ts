import { getJSON } from "../utils/network.utils";
import { PYPI_TABNINE_JUPYTERLAB_PATH } from "../consts";
import { parse as parseSemver, SemVer } from "semver";

export default async function getLatestVersion(): Promise<SemVer | undefined> {
  try {
    const response = await getJSON(PYPI_TABNINE_JUPYTERLAB_PATH);
    return parseSemver(response.info.version);
  } catch (err) {
    return undefined;
  }
}
