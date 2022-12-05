import { MongoClient, ObjectId, Collection, Document, OptionalId } from 'mongodb'
import { MONGODB_DBNAME, MONGODB_URL, MONGODB_USERS } from '../config';
import { collections } from './collections';

export interface User {
    _id?: ObjectId
    walletName: string
    password: string
    money: string
}

export interface Blocks {
    list:Block[]
}

export interface Block {
    _id?: ObjectId
    hash:string
    body:string
}

export const connectToDatabase = async () => {

    const client = new MongoClient(MONGODB_URL);

    await client.connect();

    const db = client.db(MONGODB_DBNAME);

    const usersCollection: Collection<User> = db.collection(MONGODB_USERS);

    collections.users = usersCollection;

    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
}