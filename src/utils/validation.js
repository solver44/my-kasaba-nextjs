export function validateEmpty(value) {
  if (!value || value?.length < 1) return false;
  return true;
}
