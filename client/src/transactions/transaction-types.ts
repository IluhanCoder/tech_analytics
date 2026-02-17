import { Product } from "../products/product-types";

export type Purchase = {
  id?: string;
  quantity: number;
  productId: string;
};

export type PurchaseResponse = {
  id?: string;
  product: Product;
  productId: string;
  quantity: number;
};

export type TransactionResponse = {
  id: string;
  date: Date;
  products: PurchaseResponse[];
  totalCost: number;
};

export interface ITransaction {
  id?: string;
  date: Date;
  products: Purchase[];
}

export type Transaction = {
  id: string;
  date: Date;
  products: Purchase[];
};

export interface TransactionFilter {
  id?: string;
  date?: Date;
  products?: Purchase[];
}
