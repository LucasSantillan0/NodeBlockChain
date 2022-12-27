import jwt from "jsonwebtoken";
import { TOKEN_SECRET_KEY } from "../config";

export const saveToken = (walletName: { walletName: string }) =>
  jwt.sign(walletName, TOKEN_SECRET_KEY, { expiresIn: 18000 });

export const validateToken = (token: string) => {
  try {
    console.log(token, TOKEN_SECRET_KEY);
    return jwt.verify(token, TOKEN_SECRET_KEY);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
