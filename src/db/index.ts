import { MongoClient, ObjectId, Collection, Document, OptionalId } from 'mongodb'
import { MONGODB_BLOCKS, MONGODB_DBNAME, MONGODB_URL, MONGODB_USERS } from '../config';
import { collections } from './collections';

export interface User {
    _id?: ObjectId
    walletName: string
    password: string
    money: string
}

export interface BlocksDB {
    list: BlockDB[]
}

export interface BlockDB {
    _id?: ObjectId
    hash: string
    body: string
}

export const connectToDatabase = async () => {

    const client = new MongoClient(MONGODB_URL);

    await client.connect();

    const db = client.db(MONGODB_DBNAME);

    const usersCollection: Collection<User> = db.collection(MONGODB_USERS);
    const blockCollection: Collection<BlocksDB> = db.collection(MONGODB_BLOCKS);

    collections.users = usersCollection;
    collections.blocks = blockCollection;

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}, ${blockCollection.collectionName}`);
}