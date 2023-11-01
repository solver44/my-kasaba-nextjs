import CryptoJS from "crypto-js";
import { splitFIO } from "./data";
import { convertStringToFormatted } from "./date";

const secretPass = "mykasaba@123!kiat";
export const encryptData = (text) => {
  const data = CryptoJS.AES.encrypt(
    JSON.stringify(text),
    secretPass
  ).toString();

  return data;
};

export const decryptData = (text) => {
  const bytes = CryptoJS.AES.decrypt(text, secretPass);
  const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return data;
};

export function generateTicketData(data) {
  const reqData = {
    id: data.id,
    firstName: data.member.firstName,
    lastName: data.member.lastName,
    middleName: data.member.middleName,
    birthDate: convertStringToFormatted(data.member.birthDate),
    joinDate: convertStringToFormatted(data.joinDate),
    bkutName: data.bkutName,
    director: data.director,
  };
  return encryptData(reqData);
}
