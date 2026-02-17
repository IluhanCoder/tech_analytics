import { IProduct, ProductFilter, Characteristic } from "./product-types";
import prismaClient from "../prisma-client";
import { Product } from "@prisma/client";

export default new class ProductService {
    async deleteAvatar(productId: string) {
        try {
          const product = await prismaClient.product.findUnique({where: {id: productId}});
          if (product === null || product.image === undefined) throw new Error("deleting image error");
          await prismaClient.product.update({where: { id: product.id }, data: {image: undefined}});
          return product;
        } catch (error) {
          throw error;
        }
    }

    async createProduct (data: IProduct) {
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
                        data: data.characteristics.map(({ key, value }: Characteristic) => ({
                          key: key,
                          value: value,
                        })),
                      },
                    },
                  },
            }
            console.log(query);
            return await prismaClient.product.create(query);
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async fetchProducts () {
        try {   
            return await prismaClient.product.findMany(
                {
                    include: {
                      characteristics: true, 
                  }
                });
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async updateProduct (productId: string, newData: Product) {
        try {
            return await prismaClient.product.update({
                where: { id: productId },
                data: newData
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async deleteProduct (productId: string) {
        try {
            return await prismaClient.product.delete({
                where: { id: productId }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }

    async filterProducts (filter: ProductFilter) {
        try {
            console.log(filter);
            return await prismaClient.product.findMany({
                where: {
                    ...filter
                },
                include: {
                    characteristics: true, 
                }
            })
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
}