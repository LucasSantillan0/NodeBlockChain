import { User } from "../db";
import { collections } from "../db/collections";
import { controller } from "../shared/types/controller";
import {
  getHashFrom,
  getRandomCredentials,
  getRandomHash,
} from "../utils/randomHash";
import { saveToken } from "../utils/signJWT";

export const createUser: controller = async (req, res) => {
  const { password } = req.body;
  const { walletName } = await getRandomCredentials();
  const created = await collections.users?.insertOne({
    password: getHashFrom(password),
    walletName,
    money: "0",
  });
  const user = await collections.users?.findOne({ _id: created?.insertedId });
  res.json({ wallet: user?.walletName });
};
export const findUserByWallet: controller = async (req, res) => {
  const { walletName } = req.params;
  const user = await collections.users?.findOne({ walletName });
  if (!user) {
    res.status(400).json({ error: "user not found" });
    return;
  }
  res.json(user);
};
export const findAllUsers: controller = async (req, res) => {
  const users = await collections.users?.find().toArray();
  res.json(users);
};
export const login: controller = async (req, res) => {
  const { walletName } = req.params;
  const { password } = req.body;
  console.log(getHashFrom(password));
  const user = await collections.users?.findOne({ walletName });
  if (user?.password !== getHashFrom(password)) {
    res.status(401).json({ error: "invalid walletName or password" });
    return;
  }
  res.json({ token: saveToken({ walletName: user.walletName }) });
};
