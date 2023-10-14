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
  const result = (text || "").trim();
  if (!result) return "-";
  return result;
}

export function getBearerToken(req) {
  return (req.headers?.Authorization || " ").split(" ")[1];
}

export function getLocalizationNames(object = {}, i18n) {
  return (
    object[i18n.language === "uz" ? "nameUz" : "nameRu"] ??
    object["nameUz"] ??
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

export function getFIO(obj = {}) {
  const firstName = obj.firstName ?? obj.first_name ?? "";
  const lastName = obj.lastName ?? obj.last_name ?? "";
  const middleName = obj.middleName ?? obj.middle_name ?? "";
  return !firstName ? "" : `${firstName} ${lastName} ${middleName}`;
}
