import { blockChain } from "../app";
import { collections } from "../db/collections";
import { makeOrder } from "../Order/Order";
import { cryptoCurrency } from "../shared/currencies";
import { controller } from "../shared/types/controller";

export const makeTransaction: controller = async (req, res) => {
  const { from, to, coins } = req.body;
  if (Number(coins) < 0.001) {
    res
      .status(400)
      .json({
        error: "could not complete the transaction because of the ammount ",
      });
    return;
  }
  try {
    const usersPromise = [
      collections.users?.findOne({ walletName: from }),
      collections.users?.findOne({ walletName: to }),
    ];
    await Promise.all(usersPromise)
      .then(([fromUser, toUser]) => {
        console.log(`transaction from ${fromUser} \n to ${toUser}`);
        if (!fromUser || !toUser) {
          res.json({ error: "invalid users" });
          throw new Error("invalid users");
        }
        if (!fromUser?.money || !toUser?.money) {
          fromUser.money = cryptoCurrency("0").toString();
          fromUser.money = cryptoCurrency("0").toString();
        }
        const fromUserMoney = cryptoCurrency(fromUser?.money)
          .subtract(cryptoCurrency(coins))
          .toString();
        const toUserMoney = cryptoCurrency(toUser.money)
          .add(cryptoCurrency(coins))
          .toString();
        if (cryptoCurrency(fromUserMoney).value < 0) {
          res.json({ error: "Not enough cash" });
          throw new Error("Not enough cash");
        }
        return [
          collections.users?.updateOne(
            { walletName: from },
            { $set: { money: fromUserMoney } }
          ),
          collections.users?.updateOne(
            { walletName: to },
            { $set: { money: toUserMoney } }
          ),
        ];
      })
      .then(() => {
        return blockChain.addBlock(makeOrder({ coins, from, to }));
      });
    console.log(blockChain.head.toJsonObject());
    res.json(blockChain.head.toJsonObject());
  } catch (e: any) {
    console.log(e);
  }
};
export const getTransactions: controller = async (req, res) => {
  const transactions = await collections.blocks?.find().toArray();
  res.json(transactions);
};
