import currency from 'currency.js'

export interface IOrder {
    coins: currency
    from: string
    to: string
}


export const makeOrder: (order: IOrder) => string = ({ coins, from, to }) => {
    if (!coins || !from || !to) {
        throw new Error('invalid order')
    }
    return JSON.stringify({ coins, from, to })
}