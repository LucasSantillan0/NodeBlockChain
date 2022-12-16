import { Router } from "express";
import { makeTransaction } from "../controllers/transaction";
import { createUser, findAllUsers, findUserByWallet } from "../controllers/user";

export const router = Router()

router.post('/user', createUser)
router.get('/user/:walletName', findUserByWallet)
router.get('/user/', findAllUsers)
router.post('/transaction',makeTransaction)
router.get('/transaction')