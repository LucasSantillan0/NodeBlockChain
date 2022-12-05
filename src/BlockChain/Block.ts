import { SHA256 } from 'crypto-js'
import { BlockChain } from '.'
import { MINE_RATE } from '../shared/constants'

export interface BlockConstructorArguments {
    body: string
    previousBlock: Block
    blockChain: BlockChain
}

export class Block {

    public blockChain: BlockChain

    private _body: string;
    private _previousBlock!: Block
    private _nextBlock!: Block | null

    private _hash!: string;
    private _difficulty!: number
    private _nonce!: number
    private _time!: number

    constructor({ body, previousBlock, blockChain }: BlockConstructorArguments) {
        this._hash = SHA256(body + `${blockChain.length && previousBlock._hash}`).toString();
        this._body = body
        this.blockChain = blockChain
        blockChain.length++
    }

    //TODO: Think if it's relevant to mine
    static mine(previousBlock: Block, body: string) {
        const { _hash: previousHash } = previousBlock;
        let { _difficulty: difficulty } = previousBlock;
        let hash: string;
        let time: number;
        let nonce = 0;

        do {
            time = Date.now();
            nonce += 1;
            difficulty =
                previousBlock._time + MINE_RATE > time ? difficulty + 1 : difficulty - 1;
            hash = SHA256(previousHash + time + body + nonce + difficulty).toString();
        } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

        const newBlock = new Block({ body, blockChain: previousBlock.blockChain, previousBlock });

        return newBlock
    }

    get body() {
        return this._body
    }
    get previousBlock() {
        return this._previousBlock
    }
    get nextBlock() {
        if (!this._nextBlock) {
            throw new Error("Head has no block forward")
        }
        return this._nextBlock
    }
    public fitNext(nextBlock: Block) {
        nextBlock._previousBlock = this
        this._nextBlock = nextBlock
    }

    toString() {
        const { _time: time, _previousBlock: previousBlock, _hash: hash, _body: body, _nonce: nonce, _difficulty: difficulty } = this;
        return `🧱 Block - 
            Time: ${time}
            Previous Hash: ${previousBlock._hash}
            Hash: ${hash}
            Data: ${body}
            Nonce: ${nonce}
            Difficulty: ${difficulty}
            -------------------------------------`;
    }
}