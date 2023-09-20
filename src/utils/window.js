export const localStorage =
  typeof window !== "undefined"
    ? window.localStorage
    : { getItem: () => {}, setItem: () => {}, removeItem: () => {} };
