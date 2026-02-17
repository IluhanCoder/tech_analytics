import { Request, Response } from "express";
import ProductService from "./product-service";
import { IProduct, Product } from "./product-types";
import productService from "./product-service";

export default new class ProductController {
    async createProduct (req: Request, res: Response) {
        try {
            const productData: IProduct = JSON.parse(req.body.product);
            const file = req.file;
            productData.image = file?.buffer!;
            const product = await ProductService.createProduct(productData);
            return res.status(200).json(product);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }

    async fetchProducts (req: Request, res: Response) {
        try {
            const products = await productService.fetchProducts();
            return res.status(200).json(products);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }

    async updateProduct (req: Request, res: Response) {
        try {
            const { productData } = req.body;
            const { productId } = req.params;
            const product = await productService.updateProduct(productId, productData);
            return res.status(200).json(product);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }

    async deleteProduct (req: Request, res: Response) {
        try {
            const { productId } = req.params;
            await productService.deleteProduct(productId);
            return res.status(200).send("product has been deleted succesfully");
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }

    async filterProducts (req: Request, res: Response) {
        try {
            const filter = req.body;
            const products = await productService.filterProducts(filter);
            return res.status(200).json(products);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error)
        }
    }
}