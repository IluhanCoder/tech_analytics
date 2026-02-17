"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_service_1 = __importDefault(require("../transactions/transaction-service"));
const simple_statistics_1 = __importDefault(require("simple-statistics"));
const prisma_client_1 = __importDefault(require("../prisma-client"));
const analytics_helpers_1 = require("./analytics-helpers");
exports.default = new class AnalyticsService {
    async transactionsApriori(minSupport, maxSupport, minConfidence, maxConfidence, category) {
        const transactions = await prisma_client_1.default.transaction.findMany({
            select: {
                id: true,
                date: true,
                products: {
                    select: {
                        id: true,
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                category: true,
                                description: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });
        async function fetchTransactions() {
            const transactionData = [];
            transactions.forEach((transaction) => {
                let items = transaction.products.filter((product) => { if (!product.product)
                    return false;
                else
                    return !category || product.product.category === category; });
                items = items.map((product) => { if (product.product)
                    return product.product.id; });
                if (items.length > 0)
                    transactionData.push(items);
            });
            return transactionData;
        }
        async function findFrequentPairs(data, minSupport, minConfidence, maxSupport, maxConfidence) {
            // Step 1: Count item frequencies
            const itemFrequencies = new Map();
            for (const transaction of data) {
                for (const item of transaction) {
                    if (!itemFrequencies.has(item)) {
                        itemFrequencies.set(item, 0);
                    }
                    itemFrequencies.set(item, itemFrequencies.get(item) + 1);
                }
            }
            // Step 2: Generate frequent pairs (itemsets of size 2)
            const frequentPairs = [];
            for (const item1 of itemFrequencies.keys()) {
                if (itemFrequencies.get(item1) >= minSupport && itemFrequencies.get(item1) <= maxSupport) {
                    for (const item2 of itemFrequencies.keys()) {
                        if (item1 !== item2 && itemFrequencies.get(item2) >= minSupport && itemFrequencies.get(item2) <= maxSupport) {
                            frequentPairs.push([item1, item2]);
                        }
                    }
                }
            }
            // Step 3: Calculate support for frequent pairs
            const pairSupport = new Map();
            for (const transaction of data) {
                for (const pair of frequentPairs) {
                    if (transaction.includes(pair[0]) && transaction.includes(pair[1])) {
                        if (!pairSupport.has(pair)) {
                            pairSupport.set(pair, 0);
                        }
                        pairSupport.set(pair, pairSupport.get(pair) + 1);
                    }
                }
            }
            // Step 4: Generate association rules and calculate confidence
            const frequentPairsWithInfo = [];
            for (const pair of frequentPairs) {
                const support = pairSupport.get(pair);
                const confidence = support / itemFrequencies.get(pair[0]);
                if (confidence >= minConfidence && confidence <= maxConfidence) {
                    frequentPairsWithInfo.push({
                        pair,
                        support,
                        confidence,
                    });
                }
            }
            // Step 5: Sort the rules by support and confidence
            frequentPairsWithInfo.sort((a, b) => {
                if (a.support !== b.support) {
                    return b.support - a.support;
                }
                return b.confidence - a.confidence;
            });
            let result = [];
            const getProductData = async (fp) => {
                const pair = fp.pair;
                const product1 = await prisma_client_1.default.product.findUnique({ where: { id: pair[0] } });
                const product2 = await prisma_client_1.default.product.findUnique({ where: { id: pair[1] } });
                const newData = {
                    pair: [
                        product1,
                        product2
                    ],
                    support: fp.support,
                    confidence: fp.confidence
                };
                result = [...result, newData];
            };
            await Promise.all(frequentPairsWithInfo.map(async (fp) => await getProductData(fp)));
            return result;
        }
        const dataset = await fetchTransactions();
        const frequentPairs = await findFrequentPairs(dataset, minSupport, minConfidence, maxSupport, maxConfidence);
        return (frequentPairs);
    }
    async predictSales(productId, monthToPredict) {
        const fetchHistoricalSales = async (productId) => {
            return await transaction_service_1.default.fetchRangeSales(productId);
        };
        async function predictMonthlyProductSales(productId, monthsToPredict) {
            // Fetch historical sales data for the specified product
            const historicalSales = await fetchHistoricalSales(productId);
            // Extract sales data into arrays
            const months = historicalSales.map((entry) => entry.month);
            const sales = historicalSales.map((entry) => entry.sales);
            // Create a regression model
            const monthIndexes = months.map((month) => Number(month.slice(-2)));
            const dataToLearn = monthIndexes.map((index, i = 0) => [index, sales[i++]]);
            const regressionModel = simple_statistics_1.default.linearRegression(dataToLearn);
            // Predict sales for future months
            const predictedSales = [];
            for (let i = 0; i < monthsToPredict; i++) {
                const nextMonthIndex = months.length + i + 1;
                const nextMonth = new Date();
                nextMonth.setMonth(nextMonth.getMonth() + i + 1);
                const predictedSale = regressionModel.m * nextMonthIndex + regressionModel.b;
                predictedSales.push({
                    month: formatDate(nextMonth),
                    sales: Math.max(0, predictedSale), // Ensure predictions are non-negative
                });
            }
            function formatDate(date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                return `${year}-${month}`;
            }
            return predictedSales;
        }
        return predictMonthlyProductSales(productId, monthToPredict);
    }
    async monthlyTransactions(startMonth, endMonth) {
        async function getMonthlyTransactionInfo(startMonth, endMonth) {
            const transactions = await prisma_client_1.default.transaction.findMany({
                select: {
                    date: true,
                },
                where: {
                    date: {
                        gte: new Date(startMonth),
                        lte: new Date((0, analytics_helpers_1.incrementDateByOneMonth)(endMonth)),
                    },
                },
            });
            const monthlyInfoMap = {};
            transactions.forEach((transaction) => {
                if (transaction.date) {
                    const monthYear = transaction.date.toISOString().slice(0, 7); // Extract YYYY-MM from the date
                    if (monthlyInfoMap[monthYear]) {
                        monthlyInfoMap[monthYear]++;
                    }
                    else {
                        monthlyInfoMap[monthYear] = 1;
                    }
                }
            });
            const monthlyTransactionInfo = [];
            for (const monthYear in monthlyInfoMap) {
                monthlyTransactionInfo.push({
                    month: monthYear,
                    transactions: monthlyInfoMap[monthYear],
                });
            }
            function compareMonths(a, b) {
                if (a.month < b.month) {
                    return -1;
                }
                if (a.month > b.month) {
                    return 1;
                }
                return 0;
            }
            monthlyTransactionInfo.sort(compareMonths);
            return (0, analytics_helpers_1.fillMissingMonths)(monthlyTransactionInfo, "monthlyTransactions", startMonth, endMonth);
        }
        return await getMonthlyTransactionInfo(startMonth, endMonth);
    }
    async averageTransaction(startMonth, endMonth) {
        async function getMonthlyAverageTransactionCost(startMonth, endMonth) {
            const monthlyData = {};
            const transactions = await prisma_client_1.default.transaction.findMany({
                select: {
                    date: true,
                    products: {
                        select: {
                            quantity: true,
                            product: {
                                select: {
                                    price: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    date: {
                        gte: new Date(startMonth),
                        lte: new Date((0, analytics_helpers_1.incrementDateByOneMonth)(endMonth)),
                    },
                },
            });
            transactions.forEach((transaction) => {
                if (transaction.date) {
                    const monthYear = transaction.date.toISOString().slice(0, 7);
                    if (!monthlyData[monthYear]) {
                        monthlyData[monthYear] = { totalCost: 0, transactionCount: 0 };
                    }
                    const transactionCost = transaction.products.reduce((acc, product) => {
                        if (product.product && product.quantity) {
                            return acc + product.product.price * product.quantity;
                        }
                        return acc;
                    }, 0);
                    monthlyData[monthYear].totalCost += transactionCost;
                    monthlyData[monthYear].transactionCount += 1;
                }
            });
            const monthlyAverageCost = [];
            for (const monthYear in monthlyData) {
                const { totalCost, transactionCount } = monthlyData[monthYear];
                const averageCost = transactionCount === 0 ? 0 : totalCost / transactionCount;
                monthlyAverageCost.push({
                    month: monthYear,
                    averageCost,
                });
            }
            function compareMonths(a, b) {
                if (a.month < b.month) {
                    return -1;
                }
                if (a.month > b.month) {
                    return 1;
                }
                return 0;
            }
            monthlyAverageCost.sort(compareMonths);
            return (0, analytics_helpers_1.fillMissingMonths)(monthlyAverageCost, "averageTransaction", startMonth, endMonth);
        }
        return await getMonthlyAverageTransactionCost(startMonth, endMonth);
    }
    async monthlyTransactionSum(startMonth, endMonth) {
        async function getMonthlyTransactionCosts(startMonth, endMonth) {
            const transactions = await prisma_client_1.default.transaction.findMany({
                select: {
                    date: true,
                    products: {
                        select: {
                            quantity: true,
                            product: {
                                select: {
                                    price: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    date: {
                        gte: new Date(startMonth),
                        lte: new Date((0, analytics_helpers_1.incrementDateByOneMonth)(endMonth)),
                    },
                },
            });
            const monthlyData = {};
            transactions.forEach((transaction) => {
                if (transaction.date) {
                    const monthYear = transaction.date.toISOString().slice(0, 7);
                    const transactionCost = transaction.products.reduce((acc, product) => {
                        if (product.product && product.quantity) {
                            return acc + product.product.price * product.quantity;
                        }
                        return acc;
                    }, 0);
                    if (!monthlyData[monthYear]) {
                        monthlyData[monthYear] = transactionCost;
                    }
                    else {
                        monthlyData[monthYear] += transactionCost;
                    }
                }
            });
            const monthlyTransactionCosts = [];
            for (const monthYear in monthlyData) {
                monthlyTransactionCosts.push({
                    month: monthYear,
                    transactionCostsSum: monthlyData[monthYear],
                });
            }
            function compareMonths(a, b) {
                if (a.month < b.month) {
                    return -1;
                }
                if (a.month > b.month) {
                    return 1;
                }
                return 0;
            }
            // Sort the array by month
            monthlyTransactionCosts.sort(compareMonths);
            return (0, analytics_helpers_1.fillMissingMonths)(monthlyTransactionCosts, "monthlyTransactionSum", startMonth, endMonth);
        }
        return getMonthlyTransactionCosts(startMonth, endMonth);
    }
    async monthlyProductSales(productId) {
        async function getMonthlyProductSales(productId) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear().toString();
            const startMonth = currentYear + '-01-01';
            const endMonth = currentYear + '-12-31';
            const transactions = await prisma_client_1.default.transaction.findMany({
                select: {
                    date: true,
                    products: {
                        select: {
                            productId: true,
                            quantity: true,
                        },
                    },
                },
                where: {
                    date: {
                        gte: new Date(startMonth),
                        lte: new Date((0, analytics_helpers_1.incrementDateByOneMonth)(endMonth))
                    }
                }
            });
            const monthlyData = {};
            transactions.forEach((transaction) => {
                if (transaction.date) {
                    const monthYear = transaction.date.toISOString().slice(0, 7);
                    const productSale = transaction.products.reduce((acc, product) => {
                        if (product.productId === productId && product.quantity) {
                            return acc + product.quantity;
                        }
                        return acc;
                    }, 0);
                    if (!monthlyData[monthYear]) {
                        monthlyData[monthYear] = productSale;
                    }
                    else {
                        monthlyData[monthYear] += productSale;
                    }
                }
            });
            const monthlyProductSales = [];
            for (const monthYear in monthlyData) {
                monthlyProductSales.push({
                    month: monthYear,
                    productSales: monthlyData[monthYear],
                });
            }
            function compareMonths(a, b) {
                if (a.month < b.month) {
                    return -1;
                }
                if (a.month > b.month) {
                    return 1;
                }
                return 0;
            }
            monthlyProductSales.sort(compareMonths);
            return (0, analytics_helpers_1.fillMissingMonths)(monthlyProductSales, "monthlyProductSales", startMonth.slice(0, -3), endMonth.slice(0, -3));
        }
        return await getMonthlyProductSales(productId);
    }
};
