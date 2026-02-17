export type Characteristic = {
    key: string,
    value: string
}

export type Product = {
    id: string,
    category: string,
    name: string,
    description: string,
    price: number,
    characteristics: Characteristic[],
    image: Buffer
}

export interface IProduct {
    id?: string,
    category: string,
    name: string,
    description: string,
    price: number,
    characteristics: Characteristic[],
    image: Buffer
}

export interface ProductFilter {
    category?: string,
    name?: string,
    description?: string,
    price?: number
}