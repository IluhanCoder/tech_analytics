import $api from "../axios-setup";
import { IProduct, ProductFilter } from "./product-types";

export type newProductRequestData = {
  product: IProduct;
  formData: FormData;
};

export default new (class ProductService {
  async fetchProducts() {
    return (await $api.get("/product")).data;
  }

  async newProduct(product: IProduct, image: File) {
    console.log(product);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("product", JSON.stringify(product));
    const config = {
      headers: { "content-type": "application/json" },
    };
    return await $api.post("/product", formData);
  }

  async filterProducts(filter: ProductFilter) {
    return (await $api.post("/filter-products", filter)).data;
  }

  async deleteProduct(productId: string) {
    await $api.delete(`/product/${productId}`);
  }
})();
