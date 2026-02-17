
import React, { useState, useEffect } from "react";
import PredictionGraph from "./prediction-graph";
import UnifiedLoadingScreen from "../components/UnifiedLoadingScreen";
import predictionService from "./prediction-service";
import productService from "../products/product-service";
import { Product } from "../products/product-types";
import { toast } from "react-toastify";
import { ConvertPredictionsForGraphs } from "./predictions-helpers";


// Modern, minimal, glassmorphic prediction page
const PredictionPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    productService.fetchProducts()
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setPrediction(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    setLoading(true);
    setPrediction(null);
    setError(null);
    try {
      const result = await predictionService.getPrediction(selectedProduct.id, 12);
      setPrediction(ConvertPredictionsForGraphs(result));
    } catch (e) {
      setError("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 bg-gradient-to-br from-white to-amber-50">
      <section className="w-full max-w-3xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-amber-100">
        <h1 className="text-4xl font-extrabold text-amber-600 text-center tracking-tight mb-2 drop-shadow-sm">
          Прогноз попиту на товар
        </h1>
        {loading ? (
          <UnifiedLoadingScreen label="Loading..." />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-6 md:items-end items-center justify-between">
              <div className="flex-1 w-full flex flex-col justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-1">Товар</label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                  value={selectedProduct?.id || ""}
                  onChange={(e) => {
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) handleProductSelect(prod);
                  }}
                >
                  <option value="" disabled>
                    Оберіть товар
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="px-8 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed self-end md:self-auto"
                onClick={handlePredict}
                disabled={!selectedProduct || loading}
              >
                Прогнозувати
              </button>
            </div>
            {error && <div className="text-red-500 text-center mt-2 font-medium">{error}</div>}
            {prediction && (
              <div className="mt-8">
                <PredictionGraph data={prediction} />
              </div>
            )}
            {!prediction && !error && (
              <div className="mt-8 text-center text-gray-400 text-base select-none">
                Оберіть товар і натисніть "Прогнозувати", щоб побачити прогноз попиту.
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default PredictionPage;
