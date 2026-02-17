import $api from "../axios-setup";

export default new (class PredictionService {
  async getPrediction(productId: string, months: number) {
    return (await $api.post("/predict", { productId, months })).data;
  }

  async getMonthlySales(productId: string) {
    return (await $api.post("/monthly-sales", { productId })).data;
  }
})();
