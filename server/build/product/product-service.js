"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../prisma-client"));
exports.default = new class ProductService {
    async deleteAvatar(productId) {
        try {
            const product = await prisma_client_1.default.product.findUnique({ where: { id: productId } });
            if (product === null || product.image === undefined)
                throw new Error("deleting image error");
            await prisma_client_1.default.product.update({ where: { id: product.id }, data: { image: undefined } });
            return product;
        }
        catch (error) {
            throw error;
        }
    }
    async createProduct(data) {
        try {
            const query = {
                data: {
                    name: data.name,
                    category: data.category,
                    description: data.description,
                    price: data.price,
                    image: data.image ?? null,
                    characteristics: {
                        createMany: {
                            data: data.characteristics.map(({ key, value }) => ({
                                key: key,
                                value: value,
                            })),
                        },
                    },
                },
            };
            console.log(query);
            return await prisma_client_1.default.product.create(query);
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    async fetchProducts() {
        try {
            return await prisma_client_1.default.product.findMany({
                include: {
                    characteristics: true,
                }
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    async updateProduct(productId, newData) {
        try {
            return await prisma_client_1.default.product.update({
                where: { id: productId },
                data: newData
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    async deleteProduct(productId) {
        try {
            return await prisma_client_1.default.product.delete({
                where: { id: productId }
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    async filterProducts(filter) {
        try {
            console.log(filter);
            return await prisma_client_1.default.product.findMany({
                where: {
                    ...filter
                },
                include: {
                    characteristics: true,
                }
            });
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
};
