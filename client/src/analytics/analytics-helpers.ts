import {
  AnalyticsResult,
  AverageTransactions,
  GraphFormat,
  GraphUnit,
  MonthlyTransactionAmount,
  MonthlyTransactionSum,
} from "./analytics-types";

export function convertAnalyticsForGraphs(
  analytics: AnalyticsResult,
): GraphFormat {
  const monthlyTransactionAmount: { name: string; uv: number }[] = [];
  analytics.monthlyTransactionAmount.map((unit: MonthlyTransactionAmount) => {
    monthlyTransactionAmount.push({ name: unit.month, uv: unit.transactions });
  });
  const averageTransactions: { name: string; uv: number }[] = [];
  analytics.averageTransactions.map((unit: AverageTransactions) => {
    averageTransactions.push({ name: unit.month, uv: unit.averageCost });
  });
  const monthlyTransactionSum: { name: string; uv: number }[] = [];
  analytics.monthlyTransactionSum.map((unit: MonthlyTransactionSum) => {
    monthlyTransactionSum.push({
      name: unit.month,
      uv: unit.transactionCostsSum,
    });
  });
  return {
    monthlyTransactionAmount: {
      name: "Кількість транзакцій",
      data: monthlyTransactionAmount,
    },
    averageTransactions: {
      name: "Середня сума замовлення (грн)",
      data: monthlyTransactionSum,
    },
    monthlyTransactionSum: {
      name: "Сума продажів (грн)",
      data: averageTransactions,
    },
  };
}
