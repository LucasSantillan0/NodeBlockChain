import { blockChain } from "../app"
import { collections } from "../db/collections"
import { makeOrder } from "../Order/Order"
import { cryptoCurrency } from "../shared/currencies"
import { controller } from "../shared/types/controller"

export const makeTransaction: controller = async (req, res) => {
    const { from, to, coins } = req.body
    const usersPromise = [collections.users?.findOne({ walletName: from }), collections.users?.findOne({ walletName: to })]
    Promise.all(usersPromise).then(
        ([fromUser, toUser]) => {
            return [collections.users?.updateOne({ _id: fromUser?._id }, { $set: { money: cryptoCurrency(fromUser?.money as string).subtract(cryptoCurrency(coins)).toString() } }),
            collections.users?.updateOne({ _id: toUser?._id }, { $set: { money: cryptoCurrency(toUser?.money as string).add(cryptoCurrency(coins)).toString() } })]
        }
    ).then(([fromUpdate, toUpdate]) => {
        return blockChain.addBlock(makeOrder({ coins, from, to }))
    })
        .then(() => {
            for (const block of blockChain) {
                console.log(block.body)
            }
            res.json({ ok: 'ok' })
        })
}
export const getTransations: controller = async (req, res) => {
    const transactions = await collections.blocks?.find().toArray()
    res.json(transactions)
}