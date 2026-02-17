import { Request, Response } from "express";
import prismaClient from "../prisma-client";
import transactionService from "./transaction-service";
import { ITransaction } from "./transaction-types";

export default new class TransactionController {
    async createTransaction(req: Request, res: Response) {
        try {
            const data: ITransaction = req.body;
            const result = await transactionService.createTransaction(data.date, data.products);
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }

    async fetchTransactions (req: Request, res: Response) {
        try {
            const {filter, productName} = req.body;
            const transactions = await transactionService.fetchTransactions(filter, productName);
            return res.status(200).json(transactions);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }

    async updateTransaction (req: Request, res: Response) {
        try {
            const { transactionData } = req.body;
            const { transactionId } = req.params;
            const transaction = await transactionService.updateTransaction(transactionId, transactionData);
            return res.status(200).json(transaction);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }

    async deleteTransaction (req: Request, res: Response) {
        try {
            const { transactionId } = req.params;
            await transactionService.deleteTransaction(transactionId);
            return res.status(200).send("transaction has been deleted succesfully");
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }

    async filterTransactions (req: Request, res: Response) {
        try {
            const { filter } = req.body;
            const transactions = await transactionService.filterTransactions(filter);
            return res.status(200).json(transactions);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }
}