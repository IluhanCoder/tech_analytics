import $api from "../axios-setup";

export default new (class PairService {
  async getPares(
    minSupport: number,
    maxSupport: number,
    minConfidence: number,
    maxConfidence: number,
    category?: string,
  ) {
    category = category?.length! > 0 ? category : undefined;
    const result = await $api.post("/apriori", {
      minSupport,
      maxSupport,
      minConfidence,
      maxConfidence,
      category,
    });
    return result.data;
  }
})();
