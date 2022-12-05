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
            const fromUserUpdate = { ...fromUser, money: cryptoCurrency(fromUser?.money as string).subtract(cryptoCurrency(coins)) }
            const toUserUpdate = { ...toUser, money: cryptoCurrency(toUser?.money as string).add(cryptoCurrency(coins)) }
            return [collections.users?.updateOne({ _id: fromUser?._id }, fromUserUpdate), collections.users?.updateOne({ _id: toUser?._id }, toUserUpdate)]
        }
    ).then(([fromUpdate, toUpdate]) => {
        blockChain.addBlock(makeOrder({ coins, from, to }))
    })
}