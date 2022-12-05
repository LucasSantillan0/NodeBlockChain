import { Router } from "express";
import { createUser, findUserByWallet } from "../controllers/user";

export const router = Router()

router.post('/user', createUser)
router.get('/user/:walletName', findUserByWallet)
router.post('/transaction')
router.get('/transaction')