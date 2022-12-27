import { Console } from "console";
import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/signJWT";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(400).json({ error: "no token" });
    }
    const verifiedToken = validateToken(token as string);
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};
