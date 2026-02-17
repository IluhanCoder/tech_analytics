"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_service_1 = __importDefault(require("./transaction-service"));
exports.default = new class TransactionController {
    async createTransaction(req, res) {
        try {
            const data = req.body;
            const result = await transaction_service_1.default.createTransaction(data.date, data.products);
            return res.status(200).send(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async fetchTransactions(req, res) {
        try {
            const { filter, productName } = req.body;
            const transactions = await transaction_service_1.default.fetchTransactions(filter, productName);
            return res.status(200).json(transactions);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async updateTransaction(req, res) {
        try {
            const { transactionData } = req.body;
            const { transactionId } = req.params;
            const transaction = await transaction_service_1.default.updateTransaction(transactionId, transactionData);
            return res.status(200).json(transaction);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async deleteTransaction(req, res) {
        try {
            const { transactionId } = req.params;
            await transaction_service_1.default.deleteTransaction(transactionId);
            return res.status(200).send("transaction has been deleted succesfully");
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async filterTransactions(req, res) {
        try {
            const { filter } = req.body;
            const transactions = await transaction_service_1.default.filterTransactions(filter);
            return res.status(200).json(transactions);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
};
