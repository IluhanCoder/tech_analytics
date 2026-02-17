import {
  GraphUnit,
  PredictionResponseUnit,
  MonthlySalesResponseUnit,
} from "./prediction-types";

export function ConvertPredictionsForGraphs(
  predictions: PredictionResponseUnit[],
) {
  const result: GraphUnit[] = [];
  predictions.map((prediction: PredictionResponseUnit) => {
    result.push({ name: prediction.month, uv: Math.floor(prediction.sales) });
  });
  return result;
}

export function ConvertMonthlySalesForGraphs(
  predictions: MonthlySalesResponseUnit[],
) {
  const result: GraphUnit[] = [];
  predictions.map((prediction: MonthlySalesResponseUnit) => {
    result.push({ name: prediction.month, uv: prediction.productSales });
  });
  return result;
}
