export interface MonthlyTransactionAmount {
  month: string;
  transactions: number;
}

export interface AverageTransactions {
  month: string;
  averageCost: number;
}

export interface MonthlyTransactionSum {
  month: string;
  transactionCostsSum: number;
}

export type AnalyticsResult = {
  monthlyTransactionAmount: MonthlyTransactionAmount[];
  averageTransactions: AverageTransactions[];
  monthlyTransactionSum: MonthlyTransactionSum[];
};

export interface GraphFormat {
  monthlyTransactionAmount: { name: string; data: GraphUnit[] };
  averageTransactions: { name: string; data: GraphUnit[] };
  monthlyTransactionSum: { name: string; data: GraphUnit[] };
}

export interface GraphUnit {
  name: string;
  uv: number;
}
