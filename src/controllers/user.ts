import { User } from "../db";
import { collections } from "../db/collections";
import { controller } from "../shared/types/controller";
import { getRandomCredentials, getRandomHash } from "../utils/randomHash";

export const createUser: controller = async (req, res) => {
    const { password, walletName } = await getRandomCredentials()
    const created = await collections.users?.insertOne({ password, walletName, money: '0' })
    const user = await collections.users?.findOne({ _id: created?.insertedId })
    res.json(user)
}
export const findUserByWallet: controller = async (req, res) => {
    const { walletName } = req.params
    const user = await collections.users?.findOne({ walletName })
    if (!user) {
        res.status(400).json({ error: 'user not found' })
        return
    }
    res.json(user)
}
export const findAllUsers:controller = async (req,res) => {
    const users = await collections.users?.find().toArray()
    res.json(users)
}