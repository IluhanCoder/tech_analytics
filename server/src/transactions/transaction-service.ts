import { MonthlySalesPrediction } from "../analytics/analytics-types";
import prismaClient from "../prisma-client";
import { ITransaction, Purchase, TransactionFilter } from "./transaction-types";
import { Product, Transaction, TransactionProduct } from "@prisma/client";

export default new class TransactionService {
    async createTransaction (date: Date, productData: Purchase[]) {
        const createdTransaction = await prismaClient.transaction.create({
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

    async fetchTransactions (filter: {date: {gte: Date, lte: Date}}, productName: string) {
      interface TransactionWithCost {
        id: string;
        date: Date | null;
        products: {
          id: string;
          quantity: number | null;
          productId: string | null;
          transactionId: string | null;
          product: {
            price: number;
            name: string;
          } | null;
        }[];
        totalCost: number;
      }
      
      async function getTransactionsWithCost(filter: {date: {gte: Date, lte: Date}}, productName: string): Promise<TransactionWithCost[]> {
        let transactions = await prismaClient.transaction.findMany({
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

        if(productName) transactions = transactions.filter((transaction: any) =>
          transaction.products.some((product: any) => product.product && product.product.name.toUpperCase().includes(productName.toUpperCase())))
      
        const transactionsWithCost: any[] = [];
      
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

    async updateTransaction (transactionId: string, newData: Transaction) {
        try {
            return await prismaClient.transaction.update({
                where: { id: transactionId },
                data: newData
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async deleteTransaction (transactionId: string) {
        try {
            return await prismaClient.transaction.delete({
                where: { id: transactionId }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async filterTransactions (filter: Transaction) {
        try {
            return await prismaClient.transaction.findMany({
                where: {
                    ...filter
                }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
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

    async fetchRangeSales(productId: string) {
      const transactions = (await prismaClient.transaction.findMany({
        include: {
          products: {
            where: {
              productId
            }
          },
        },
      })).filter((transaction) => transaction.products.length > 0);

    const monthlySalesMap = new Map<string, number>();

    // Iterate through transactions and accumulate sales by month
    for (const transaction of transactions) {
      const transactionDate = transaction.date;
      if (transactionDate) {
        const monthYear = transactionDate.toISOString().slice(0, 7); // Format: "YYYY-MM"
        const productQuantity = transaction.products.find((p) => p.productId === productId)?.quantity || 0;
        if (!monthlySalesMap.has(monthYear)) {
          monthlySalesMap.set(monthYear, 0);
        }
        monthlySalesMap.set(monthYear, monthlySalesMap.get(monthYear)! + productQuantity);
      }
    }

    // Convert the map into an array of MonthlySales objects
    const monthlySales: MonthlySalesPrediction[] = Array.from(monthlySalesMap).map(([month, sales]) => ({
      month,
      sales,
    }));

    return monthlySales;
  }
}