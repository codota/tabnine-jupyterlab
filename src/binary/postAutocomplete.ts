import postBinary from "./postBinary";

export type ResultEntry = {
  new_prefix: string;
  old_suffix: string;
  new_suffix: string;

  detail?: string;
};

export type AutocompleteResult = {
  old_prefix: string;
  results: ResultEntry[];
  user_message: string[];
  is_locked: boolean;
};

export type AutocompleteParams = {
  filename: string;
  before: string;
  after: string;
  region_includes_beginning: boolean;
  region_includes_end: boolean;
  max_num_results: number;
};

export default async function postAutocomplete(
  params: AutocompleteParams
): Promise<AutocompleteResult> {
  return postBinary<{ Autocomplete: AutocompleteParams }, AutocompleteResult>({
    Autocomplete: params,
  });
}
