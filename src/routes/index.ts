import { Router } from "express";
import { getTransactions, makeTransaction } from "../controllers/transaction";
import {
  createUser,
  findAllUsers,
  findUserByWallet,
  login,
} from "../controllers/user";
import { verifyToken } from "../middlewares/verifyToken";

export const router = Router();

router.post("/user", createUser);
router.get("/user/:walletName", [verifyToken], findUserByWallet);
router.get("/user/", [verifyToken], findAllUsers);
router.post("/transaction", [verifyToken], makeTransaction);
router.get("/transaction", [verifyToken], getTransactions);
router.post("/login/:walletName", login);
