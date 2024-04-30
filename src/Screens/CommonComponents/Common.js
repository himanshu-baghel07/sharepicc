import CryptoJS from "crypto-js";
import * as StellarSdk from "@stellar/stellar-sdk";

export const encrypt = (data, keyword) => {
  const encryptedLoginData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    keyword
  );
  return encryptedLoginData.toString();
};

export const decrypt = (item, keyword) => {
  try {
    const decryptedData = CryptoJS.AES.decrypt(item, keyword).toString(
      CryptoJS.enc.Utf8
    );
    const decryptedDataJson = JSON.parse(decryptedData);
    return decryptedDataJson;
  } catch (error) {
    return null;
  }
};

export const checkSecretKey = (e, setIsValid, setPrivateAdd) => {
  const value_ = e.target.value;
  const valid = StellarSdk.StrKey.isValidEd25519SecretSeed(value_);
  setIsValid(valid);
  setPrivateAdd(value_);
};
