import dayjs from "dayjs";

export function convertToDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  // Check if the parsed components are valid
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null; // Invalid date
  }

  // JavaScript months are 0-based, so we subtract 1 from the parsed month
  return new Date(year, month - 1, day);
}
export function convertStringToFormatted(dateString) {
  const date = dayjs(dateString);
  return date.format("DD.MM.YYYY");
}
