export type Purchase = {
    id: string,
    quantity: number,
    productId: string
}

export interface ITransaction {
    id?: string,
    date: Date,
    products: Purchase[]
}

export type Transaction = {
    id: string,
    date: Date,
    products: Purchase[]
}

export interface TransactionFilter {
    id?: string,
    date?: Date,
    products?: Purchase[]
}