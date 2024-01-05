export const localStorage =
  typeof window !== "undefined"
    ? window.localStorage
    : { getItem: () => {}, setItem: () => {}, removeItem: () => {} };

export function getUrlWithQuery(newPath, queryParameters = {}) {
  const newURL = new URL(window.location.origin + newPath);
  for (const key in queryParameters) {
    if (queryParameters.hasOwnProperty(key)) {
      newURL.searchParams.append(key, queryParameters[key]);
    }
  }
  return newURL.toString();
}

export function openBlankURL(newURL) {
  if (!newURL) return;
  window.open(newURL, "_blank");
}
