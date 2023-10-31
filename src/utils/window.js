export const localStorage =
  typeof window !== "undefined"
    ? window.localStorage
    : { getItem: () => {}, setItem: () => {}, removeItem: () => {} };

export function openUrlWithQuery(newPath, queryParameters) {
  const newURL = new URL(window.location.origin + newPath);
  for (const key in queryParameters) {
    if (queryParameters.hasOwnProperty(key)) {
      newURL.searchParams.append(key, queryParameters[key]);
    }
  }
  window.open(newURL.toString(), "_blank");
}
