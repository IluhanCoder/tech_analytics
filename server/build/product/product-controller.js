"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("./product-service"));
const product_service_2 = __importDefault(require("./product-service"));
exports.default = new class ProductController {
    async createProduct(req, res) {
        try {
            const productData = JSON.parse(req.body.product);
            const file = req.file;
            productData.image = file?.buffer;
            const product = await product_service_1.default.createProduct(productData);
            return res.status(200).json(product);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async fetchProducts(req, res) {
        try {
            const products = await product_service_2.default.fetchProducts();
            return res.status(200).json(products);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async updateProduct(req, res) {
        try {
            const { productData } = req.body;
            const { productId } = req.params;
            const product = await product_service_2.default.updateProduct(productId, productData);
            return res.status(200).json(product);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async deleteProduct(req, res) {
        try {
            const { productId } = req.params;
            await product_service_2.default.deleteProduct(productId);
            return res.status(200).send("product has been deleted succesfully");
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
    async filterProducts(req, res) {
        try {
            const filter = req.body;
            const products = await product_service_2.default.filterProducts(filter);
            return res.status(200).json(products);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
};
