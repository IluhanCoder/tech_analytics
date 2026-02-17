import { Product } from "../products/product-types";

export type PairsResponse = {
  pair: Product[];
  support: number;
  confidence: number;
};
