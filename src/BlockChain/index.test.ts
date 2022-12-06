import { BlockChain } from "../BlockChain";

describe('Blockchain', () => {
    const blockchain = new BlockChain('1')
    test('Should have an id', () => {
        expect(blockchain.id).toBe('1')
    })
    test('Should have a head', () => {
        blockchain.addBlock("{\"first block\":true}")
        expect(blockchain.head.body).toBe("{\"first block\":true}")
    })
    test('Should add a block correctly', () => {
        blockchain.addBlock('second block')
        expect(blockchain.head.body).toBe('second block')
    })
    test('Should have the correct references', () => {
        const first = blockchain.head.previousBlock
        expect(first.body).toBe("{\"first block\":true}")
        expect(first.nextBlock.body).toBe('second block')
    })
    test('Should iterate correctly', () => {
        const bodies = ['1', '2', '3']
        const iterableBlockChain = new BlockChain('2')
            .addBlock(...bodies)
        expect(iterableBlockChain.length)
        let i = 0
        for (const block of iterableBlockChain) {
            expect(block.body).toBe(bodies[i])
            i++
        }
    })
})