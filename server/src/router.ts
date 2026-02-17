import { Express, Request, Response, Router } from "express";
import productController from "./product/product-controller";
import signup from "./user/auth-controller";
import authController from "./user/auth-controller";
import multer from "multer";
import path from "path";
import authMiddleware from "./user/auth-middleware";
import transactionController from "./transactions/transaction-controller";
import analyticsController from "./analytics/analytics-controller";

const router = Router();
const upload = multer();

router.get('/', (req: Request, res: Response) => {
    return res.send("get success");
})

router.post('/', authController.userVerification);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/product', authMiddleware, upload.single("file"), productController.createProduct);
router.get('/product', authMiddleware, productController.fetchProducts);
router.put('/product/:productId', authMiddleware, productController.updateProduct);
router.delete('/product/:productId', authMiddleware, productController.deleteProduct);
router.post('/filter-products', authMiddleware, productController.filterProducts);

router.post('/transaction', authMiddleware, transactionController.createTransaction);
router.post('/fetch-transactions', authMiddleware, transactionController.fetchTransactions);
router.put('/transaction/:transactionId', authMiddleware, transactionController.updateTransaction);
router.delete('/transaction/:transactionId', authMiddleware, transactionController.deleteTransaction);
router.post('/filter-transactions', authMiddleware, transactionController.filterTransactions);

router.post('/apriori', authMiddleware, analyticsController.transactionsApriori);
router.post('/predict', authMiddleware, analyticsController.predictSales);
router.post('/monthly', authMiddleware, analyticsController.monthlySales);
router.post('/average-transaction', authMiddleware, analyticsController.averageTransaction);
router.post('/transaction-sum', authMiddleware, analyticsController.monthlyTransactionCost);
router.post('/monthly-sales', authMiddleware, analyticsController.monthlyProductSales);

export default router;