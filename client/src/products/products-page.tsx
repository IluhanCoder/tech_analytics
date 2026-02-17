import { buttonStyle } from "../styles/button-styles";
import ProductsCatalogue from "./products-catalogue";
import { Link } from "react-router-dom";



const ProductsPage = () => {
  return (
    <div className="min-h-[90vh] flex flex-col items-center bg-gradient-to-br from-gray-50 to-white py-12 px-2">
      {/* Hero Section */}
      <section className="w-full max-w-3xl text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">Каталог товарів</h1>
        <p className="text-base text-gray-500 font-medium mb-0">Оберіть товар або скористайтесь фільтрами для швидкого пошуку</p>
      </section>
      {/* Search & Catalogue Section */}
      <section className="w-full max-w-6xl flex flex-col gap-8 bg-white/80 rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
        <ProductsCatalogue deleteAvailable />
      </section>
    </div>
  );
};

export default ProductsPage;
