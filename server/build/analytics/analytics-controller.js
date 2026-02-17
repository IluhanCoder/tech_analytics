"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_service_1 = __importDefault(require("./analytics-service"));
exports.default = new class AnalyticsController {
    async transactionsApriori(req, res) {
        try {
            const { minSupport, maxSupport, minConfidence, maxConfidence, category } = req.body;
            const result = await analytics_service_1.default.transactionsApriori(minSupport, maxSupport, minConfidence, maxConfidence, category);
            return res.status(200).send(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async predictSales(req, res) {
        try {
            const { productId, months } = req.body;
            const result = await analytics_service_1.default.predictSales(productId, months);
            return res.status(200).send(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async monthlySales(req, res) {
        try {
            const { startMonth, endMonth } = req.body;
            const result = await analytics_service_1.default.monthlyTransactions(startMonth, endMonth);
            return res.status(200).send(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async averageTransaction(req, res) {
        try {
            const { startMonth, endMonth } = req.body;
            const result = await analytics_service_1.default.averageTransaction(startMonth, endMonth);
            return res.status(200).send(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async monthlyTransactionCost(req, res) {
        try {
            const { startMonth, endMonth } = req.body;
            console.log(startMonth);
            console.log(endMonth);
            const result = await analytics_service_1.default.monthlyTransactionSum(startMonth, endMonth);
            return res.status(200).send(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async monthlyProductSales(req, res) {
        try {
            const { productId } = req.body;
            const result = await analytics_service_1.default.monthlyProductSales(productId);
            return res.status(200).send(result);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
};
