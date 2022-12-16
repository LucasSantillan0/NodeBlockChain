import Express from 'express'
import { BlockChain } from './BlockChain'
import { PORT } from './config'
import { connectToDatabase } from './db'
import { router } from './routes'

const app = Express()

app.set('PORT', PORT)

app.use(Express.json())
app.use('/api', router)

export const blockChain = new BlockChain('test')

connectToDatabase().then(() => {
    app.listen(PORT || 8080, () => {
        console.log(`Server listening at ${PORT}`)
    })
}
).then(() => {
    blockChain.restoreBlockChainFromDatabase();
})