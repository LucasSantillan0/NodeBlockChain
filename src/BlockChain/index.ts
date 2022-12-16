import { BlockDB } from "../db";
import { collections } from "../db/collections";
import { Block, BlockConstructorArguments } from "./Block";

export class BlockChain implements Iterable<Block>{

    private _head: Block;
    private _tail: Block;
    public length: number;
    public id: string;
    constructor(id: string) {
        this.id = id
        this.length = 0
        this._head = null as unknown as Block
        this._tail = null as unknown as Block
    }

    public async addBlock(...bodies: string[]) {
        this.createBlock(...bodies)
        await this.saveLastBlock()
        return this
    }
    private createBlock(...bodies: string[]) {
        bodies.forEach(body => {
            console.log('add')
            const newBlock = new Block({ body, previousBlock: this.head, blockChain: this });
            if (!this._head) {
                this._head = newBlock
                this._tail = newBlock
            }
            else {
                this._head.fitNext(newBlock)
                this._head = newBlock
            }
            this.length++
        })
        return this
    }

    *[Symbol.iterator](): IterableIterator<Block> {
        if (!this.length) return
        try {
            let current = this._tail;
            yield current
            while (current.nextBlock) {
                current = current.nextBlock
                yield current
            }
        }
        catch (e) {
        }
    }

    public async restoreBlockChainFromDatabase() {
        console.log('restoring')
        const blockCollection = await collections.blocks?.find().toArray()
        console.log(blockCollection)
        const bodies = blockCollection?.filter(block => block.body).map(block => block.body)
        bodies?.length && this.createBlock(...bodies)
        console.log('length:', this.length)
        for (const blocks of this) {
            console.log(blocks.body)
        }
    }

    private cleanBlockChain() {
        let current = this.tail
        while (current?.nextBlock) {
            const aux = current
            current = current.nextBlock
            aux.clean()
        }
        this._tail = null as unknown as Block
        this._head = null as unknown as Block
    }

    //TODO:save blocks in database
    private async saveLastBlock() {
        await collections.blocks?.insertOne({ body: this._head.body, hash: this._head.hash })
    }

    get head() {
        return this._head
    }
    get tail() {
        return this._tail
    }

} 