"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../prisma-client"));
exports.default = new class TransactionService {
    async createTransaction(date, productData) {
        const createdTransaction = await prisma_client_1.default.transaction.create({
            data: {
                date: date,
                products: {
                    create: productData.map(({ productId, quantity }) => ({
                        product: {
                            connect: { id: productId },
                        },
                        quantity: quantity,
                    })),
                },
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return createdTransaction;
    }
    async fetchTransactions(filter, productName) {
        async function getTransactionsWithCost(filter, productName) {
            let transactions = await prisma_client_1.default.transaction.findMany({
                select: {
                    id: true,
                    date: true,
                    products: {
                        select: {
                            quantity: true,
                            product: {
                                select: {
                                    price: true,
                                    name: true,
                                    category: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    date: {
                        gte: filter.date.gte,
                        lte: filter.date.lte
                    }
                }
            });
            if (productName)
                transactions = transactions.filter((transaction) => transaction.products.some((product) => product.product && product.product.name.toUpperCase().includes(productName.toUpperCase())));
            const transactionsWithCost = [];
            transactions.forEach((transaction) => {
                if (transaction.date) {
                    const totalCost = transaction.products.reduce((acc, product) => {
                        if (product.product && product.quantity) {
                            return acc + product.product.price * product.quantity;
                        }
                        return acc;
                    }, 0);
                    transactionsWithCost.push({
                        id: transaction.id,
                        date: transaction.date,
                        products: transaction.products,
                        totalCost,
                    });
                }
            });
            return transactionsWithCost;
        }
        return await getTransactionsWithCost(filter, productName);
    }
    async updateTransaction(transactionId, newData) {
        try {
            return await prisma_client_1.default.transaction.update({
                where: { id: transactionId },
                data: newData
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    async deleteTransaction(transactionId) {
        try {
            return await prisma_client_1.default.transaction.delete({
                where: { id: transactionId }
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    async filterTransactions(filter) {
        try {
            return await prisma_client_1.default.transaction.findMany({
                where: {
                    ...filter
                }
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    // async getTransactionByProductName (productName: string) {
    //   const transactions = await prismaClient.transaction.findMany({
    //     where: {
    //       products: {
    //         some: {
    //           product: {
    //             name: {
    //               equals: productName,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    //   return transactions;
    // }
    async fetchRangeSales(productId) {
        const transactions = (await prisma_client_1.default.transaction.findMany({
            include: {
                products: {
                    where: {
                        productId
                    }
                },
            },
        })).filter((transaction) => transaction.products.length > 0);
        const monthlySalesMap = new Map();
        // Iterate through transactions and accumulate sales by month
        for (const transaction of transactions) {
            const transactionDate = transaction.date;
            if (transactionDate) {
                const monthYear = transactionDate.toISOString().slice(0, 7); // Format: "YYYY-MM"
                const productQuantity = transaction.products.find((p) => p.productId === productId)?.quantity || 0;
                if (!monthlySalesMap.has(monthYear)) {
                    monthlySalesMap.set(monthYear, 0);
                }
                monthlySalesMap.set(monthYear, monthlySalesMap.get(monthYear) + productQuantity);
            }
        }
        // Convert the map into an array of MonthlySales objects
        const monthlySales = Array.from(monthlySalesMap).map(([month, sales]) => ({
            month,
            sales,
        }));
        return monthlySales;
    }
};
