import { Block, BlockConstructorArguments } from "./Block";

export class BlockChain implements Iterable<Block>{

    private _head: Block;
    private _tail: Block;
    public length: number;
    public id: string;
    constructor(id: string) {
        this.id = id
        this.length = 0
        const firstBlock = new Block({
            body: JSON.stringify({ 'first block': true }),
            previousBlock: (null as unknown as Block),
            blockChain: this
        })
        this._head = firstBlock
        this._tail = firstBlock
    }

    public addBlock(...bodies: string[]) {
        bodies.forEach(body => {
            const newBlock = new Block({ body, previousBlock: this.head, blockChain: this });
            this._head.fitNext(newBlock)
            this._head = newBlock
        })
        return this
    }


    //TODO: Think if it's relevant to mine
    private mine(body: string) {
        const currentTail = this._tail
        const newBlock = Block.mine(currentTail, body)
        if (this._tail !== currentTail) {
            this.mine(body)
        }
    }

    *[Symbol.iterator](): IterableIterator<Block> {
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
    get head() {
        return this._head
    }
    get tail() {
        return this._tail
    }
} 