import { randomBytes } from "crypto";
import { SHA256 } from "crypto-js";
import { collections } from "../db/collections";

export const getRandomHash = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getRandomCredentials: () => Promise<{
  walletName: string;
  password: string;
}> = async () => {
  try {
    const walletName = getRandomHash(25);
    const password = getRandomHash(25);
    const existWalletName = await collections.users?.findOne({ walletName });
    if (existWalletName) {
      return getRandomCredentials();
    }
    return { walletName, password };
  } catch (e) {
    throw e;
  }
};

export const getHashFrom = (str: string) => SHA256(str).toString();
