import dayjs from "dayjs";
import { t } from "i18next";

export function convertToDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  // Check if the parsed components are valid
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null; // Invalid date
  }

  // JavaScript months are 0-based, so we subtract 1 from the parsed month
  return new Date(year, month - 1, day);
}
export function convertStringToFormatted(dateString, withTime) {
  if(!dateString) return "";
  const date = dayjs(dateString);
  return date.format(withTime ? "DD.MM.YYYY  HH:m" : "DD.MM.YYYY");
}

function asLocalDate(dateString) {
  return new Date(dateString);
}
export function getRestOfDays(date2, date1) {
  if (!date1 || !date2) return 0;
  const localEndDate = asLocalDate(date2);
  return Math.round((localEndDate - date1) / (1000 * 60 * 60 * 24));
}
export function getFormattedWithRestDay(date) {
  if (!date) return t("no");
  const formattedDate = convertStringToFormatted(date);
  const restOfDays = getRestOfDays(date, new Date());
  const result = `${formattedDate} (${restOfDays} ${t("leave-day")})`;
  return result;
}

export function isOutdated(dateString) {
  if (!dateString) return true;
  const restOfDays = getRestOfDays(dateString, new Date());
  return restOfDays <= 0 ? true : false;
}
