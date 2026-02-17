export type Characteristic = {
  key: string;
  value: string;
};

export type Product = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  characteristics: Characteristic[];
  image?: any;
};

export interface IProduct {
  id?: string;
  category: string;
  name: string;
  description: string;
  price: number;
  characteristics: Characteristic[];
  image?: File;
}

export interface ProductFilter {
  category?: string | { contains: string };
  name?: string | { contains: string };
  description?: string | { contains: string };
  price?: number | { gt: number; lt: number };
}
