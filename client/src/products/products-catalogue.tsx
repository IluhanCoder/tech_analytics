import UnifiedLoadingScreen from "../components/UnifiedLoadingScreen";
import { useState, useEffect } from "react";
import { Product, ProductFilter } from "./product-types";
import productService from "./product-service";
import { Buffer } from "buffer";
import ProductSearchBar from "./product-search-bar";
import CharacteristicsMapper from "./characteristics-mapper";
import { cardStyle } from "../styles/card-styles";
import { buttonStyle, deleteButtonStyle } from "../styles/button-styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type LocalParams = {
  isPicker?: boolean;
  onPick?: (picketProduct: Product) => {};
  deleteAvailable?: boolean;
};
const ProductsCatalogue = (params: LocalParams) => {
  const { isPicker, onPick, deleteAvailable } = params;

  const [products, setProducts] = useState<Product[]>();

  const defaultImage = process.env.REACT_APP_IMAGE_PLACEHOLDER;

  async function fetchProducts() {
    try {
      const fetchResult: Product[] = await productService.fetchProducts();
      setProducts(fetchResult);
    } catch(error: any) {
      if(error.status === 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  }

  const convertImage = (image: any) => {
    if(!image) return defaultImage;
    return `data:image/jpeg;base64,${Buffer.from(image!.data).toString("base64")}`;
  };

  const handleFilter = async (filter: ProductFilter) => {
    setProducts(undefined);
    const newProducts = await productService.filterProducts(filter);
    setProducts(newProducts);
  };

  const handleDelete = async (productId: string) => {
    await productService.deleteProduct(productId);
    toast.success("товар успішно видалено");
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <div className="mb-6">
        <ProductSearchBar onSubmit={handleFilter} />
      </div>
      {products ? (
        products.length > 0 ? (
          <div className={isPicker ? "overflow-auto max-h-96" : ""}>
            <div
              className={`grid ${isPicker ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-4 px-2 py-4`}
            >
              {products.map((product: Product) => (
                <div
                  key={product.id}
                  className="relative min-w-[220px] max-w-xs bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-shadow duration-200 group overflow-hidden p-0"
                >
                  {/* Image & Floating Buttons Section */}
                  <div className="relative flex items-center justify-center bg-gray-100 border-b border-gray-200 rounded-t-3xl h-44">
                    {/* Floating Price Tag */}
                    <span className="absolute top-3 left-3 z-10 bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-base font-bold shadow-md opacity-90">{product.price} грн</span>
                    {deleteAvailable && (
                      <button
                        className="absolute top-3 right-3 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 shadow"
                        type="button"
                        title="Видалити"
                        onClick={() => handleDelete(product.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {product.image ? (
                      <img
                        className="h-32 w-32 object-contain rounded-2xl border border-gray-200 shadow group-hover:scale-105 transition-transform duration-200 bg-white"
                        src={convertImage(product.image!)}
                        alt={product.name}
                      />
                    ) : (
                      <span className="flex flex-col items-center justify-center h-32 w-32 rounded-2xl bg-gray-100 border border-gray-200 shadow text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v9.75M3 16.5V17.25A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25V16.5m-18 0a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 16.5m-9-4.125a2.625 2.625 0 105.25 0 2.625 2.625 0 00-5.25 0z" />
                        </svg>
                        <span className="text-xs">Немає зображення</span>
                      </span>
                    )}
                  </div>
                  {/* Product Info */}
                  <div className="flex flex-col flex-1 px-6 pt-4 pb-6 gap-2">
                    <div className="flex flex-row items-center gap-2 mb-1">
                      <div className="text-xl font-bold text-gray-900 truncate drop-shadow-sm flex-1">{product.name}</div>
                      <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{product.category}</span>
                    </div>
                    {!isPicker && product.description && (
                      <div className="text-gray-600 text-sm mb-1 italic line-clamp-2">{product.description}</div>
                    )}
                    {!isPicker && (
                      <div className="flex flex-col mt-1">
                        <div className="text-xs font-medium text-gray-400 mb-1">Характеристики:</div>
                        <CharacteristicsMapper characteristics={product.characteristics} />
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="flex flex-row gap-2 mt-4">
                      {isPicker && (
                        <button
                          className="flex-1 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-md transition-colors"
                          type="button"
                          onClick={() => onPick!(product)}
                        >
                          Обрати
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="mt-16 text-center text-3xl text-gray-400">Товари відсутні</div>
          </div>
        )
      ) : (
        <div className="flex justify-center">
          <div className="mt-16 text-center text-3xl text-gray-400">
            <UnifiedLoadingScreen label="Підвантаження товарів..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsCatalogue;
