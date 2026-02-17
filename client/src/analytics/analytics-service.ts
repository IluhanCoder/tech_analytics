import $api from "../axios-setup";
import { AnalyticsResult } from "./analytics-types";

export default new (class AnalyticsService {
  formatDateToYYYYMM(date: Date) {
    const year = date.getFullYear();
    // JavaScript months are zero-indexed, so we add 1 to get the correct month
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Zero-padding

    return `${year}-${month}`;
  }

  async getAnalyticsData(startDate: Date, endDate: Date) {
    const startMonth = this.formatDateToYYYYMM(startDate);
    const endMonth = this.formatDateToYYYYMM(endDate);
    const monthlyTransactionAmount = (
      await $api.post("/monthly", { startMonth, endMonth })
    ).data;
    const averageTransactions = (
      await $api.post("/average-transaction", { startMonth, endMonth })
    ).data;
    const monthlyTransactionSum = (
      await $api.post("/transaction-sum", { startMonth, endMonth })
    ).data;
    const result: AnalyticsResult = {
      monthlyTransactionAmount,
      averageTransactions,
      monthlyTransactionSum,
    };
    return result;
  }
})();
