import CryptoJS from 'crypto-js';

const secretPass = 'comnet@123!iplus';
export const encryptData = text => {
  const data = CryptoJS.AES
    .encrypt (JSON.stringify (text), secretPass)
    .toString ();

  return data;
};

export const decryptData = text => {
  const bytes = CryptoJS.AES.decrypt (text, secretPass);
  const data = JSON.parse (bytes.toString (CryptoJS.enc.Utf8));
  return data;
};
