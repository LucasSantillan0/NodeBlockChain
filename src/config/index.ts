import { config } from "dotenv"

config()

export const { PORT, MONGODB_DBNAME, MONGODB_USERS, MONGODB_BLOCKS, MONGODB_URL, TOKEN_SECRET_KEY } = process.env as Record<string, string>