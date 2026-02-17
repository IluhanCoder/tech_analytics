export type PredictionResponseUnit = {
  month: string;
  sales: number;
};

export interface GraphUnit {
  name: string;
  uv: number;
}

export type MonthlySalesResponseUnit = {
  month: string;
  productSales: number;
};
