import $api from "../axios-setup";
import { ITransaction } from "./transaction-types";

export default new (class TransactionService {
  async createTransaction(data: ITransaction) {
    await $api.post("/transaction", data);
  }

  async fetchTransactions(
    filter: { date: { gte: Date; lte: Date } },
    productName: string,
  ) {
    return (await $api.post("/fetch-transactions", { filter, productName }))
      .data;
  }

  async deleteTransactions(transactionId: string) {
    await $api.delete(`/transaction/${transactionId}`);
  }
})();
