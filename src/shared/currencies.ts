import currency from "currency.js";

export const cryptoCurrency = (money: string) => currency(money, { precision: 8 })
