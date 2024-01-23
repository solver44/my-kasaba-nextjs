import dayjs from "dayjs";
import i18next, { t } from "i18next";

export function generateUniqueId(length = 9) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export function showOrNot(text = "") {
  let txt = text;
  if (text) txt = text.toString();
  const result = (txt || "").trim();
  if (!result) return "-";
  return result;
}

export function getBearerToken(req) {
  return (req.headers?.Authorization || " ").split(" ")[1];
}

export function getLocalizationNames(object = {}, _i18n) {
  let i18n = _i18n ?? i18next;
  return (
    object[i18n.language === "uz" ? "nameUz" : "nameRu"] ??
    object["nameUz"] ??
    ""
  );
}
export function getLocLabel(object = {}) {
  return (
    object[i18next.language === "uz" ? "label" : "labelRu"] ??
    object["label"] ??
    ""
  );
}

export function replaceValueWithLabel(obj) {
  const newObj = { ...obj }; // Create a new object to avoid modifying the original
  for (const key in newObj) {
    if (newObj[key]?.label) {
      newObj[key] = newObj[key].label;
    }
  }
  return newObj;
}

export function replaceValuesInArray(arr) {
  return arr.map((obj) => replaceValueWithLabel(obj));
}

export const POSITIONS = (t) => [
  { value: 1, label: t("employees.chairman") },
  { value: 2, label: t("employees.accountant") },
];

export function getFIO(obj = {}, isNotEmpty) {
  const firstName = obj.firstName ?? obj.first_name ?? obj.person_name ?? "";
  const lastName = obj.lastName ?? obj.last_name ?? obj.person_surname ?? "";
  const middleName =
    obj.middleName ?? obj.middle_name ?? obj.person_patronymic ?? "";
  return (
    `${lastName} ${firstName} ${middleName}`.trim() || (isNotEmpty ? "-" : "")
  );
}
export function splitFIO(fio = "") {
  let splitted = fio.split(" ");
  if (splitted.length > 3) {
    splitted[2] = `${splitted[2]} ${splitted.pop()}`;
  }
  if (splitted.length < 3) splitted.push("");
  if (splitted.length < 3) splitted.push("");
  if (splitted.length < 3) splitted.push("");
  let firsName = splitted[1];
  splitted[1] = splitted[0];
  splitted[0] = firsName;
  return splitted;
}

export function splitEmployement(employment = "") {
  if (!employment) return {};
  const splitted = employment.split(",").map((e) => e.trim().toLowerCase());
  return splitted.reduce((old, current) => {
    if (current.includes(t("isHomemaker").toLowerCase()))
      old.isHomemaker = true;
    if (current.includes(t("isInvalid").toLowerCase())) old.isInvalid = true;
    if (current.includes(t("isPensioner").toLowerCase()))
      old.isPensioner = true;
    if (current.includes(t("isStudent").toLowerCase())) old.isStudent = true;

    return old;
  }, {});
}

export function getEmptyValue(obj) {
  if (typeof obj !== "object" && typeof obj !== "undefined") return obj;
  for (var prop in obj ?? {}) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return obj;
    }
  }

  return undefined;
}

export function getPresidentBKUT(bkutData = {}) {
  if (!bkutData?.employees?.length) return "";
  return getFIO(
    bkutData.employees.find((employee) => employee.position?.id === 1)
      ?.individual
  );
}

export function getLastPosition(data = {}) {
  const experiences = data.experiences || [];
  if (experiences?.length < 1) return "";
  return experiences.sort(
    (a, b) => dayjs(b?.contract_date) - dayjs(a?.contract_date)
  )[0]?.position_name;
}

export function getPresidentId(bkutData = {}) {
  if (!bkutData?.employees?.length) return "";
  return bkutData.employees.find((employee) => employee.position?.id === 1)
    ?.individual?.id;
}

export function getStatusColors(val) {
  switch (val) {
    case "INEXECUTION":
    case "INANALYSIS":
      return "warning";
    case "CONFIRMED":
      return "primary";
    case "CONSIDERED":
      return "success";
    case "EXPIRED":
      return "error";
    case "NEAR_EXPIRED":
      return "warning";
    case "TO_CONFIRM":
    default:
      return "info";
  }
}

export function getIsOrganization(text) {
  return (text ?? localStorage.getItem("type")) === "organization";
}
