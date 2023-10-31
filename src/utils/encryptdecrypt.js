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
  const fio = splitFIO(data.fio);
  const reqData = {
    id: data.id,
    firstName: fio[0],
    lastName: fio[1],
    middleName: fio[2],
    birthDate: convertStringToFormatted(data.birthDate),
    joinDate: convertStringToFormatted(data.signDate),
    bkutName: data.bkutName,
    director: data.director,
  };
  return encryptData(reqData);
}
