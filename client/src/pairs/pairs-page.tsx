import UnifiedLoadingScreen from "../components/UnifiedLoadingScreen";
import { useState, useEffect } from "react";
import { PairsResponse } from "./pairs-types";
import pairsService from "./pairs-service";
import { Buffer } from "buffer";
import { cardStyle } from "../styles/card-styles";
import { buttonStyle } from "../styles/button-styles";
import { inputStyle } from "../styles/form-styles";
import React, { useRef } from 'react';
import html2PDF from "jspdf-html2canvas";
import { ToastContainer, toast } from "react-toastify";
import categoriesArray from "../misc/categories-array";

const PairsPage = () => {
  const [minSupport, setMinSupport] = useState<number>(3);
  const [maxSupport, setMaxSupport] = useState<number>(6);
  const [minConfidence, setMinConfidence] = useState<number>(0.1);
  const [maxConfidence, setMaxConfidence] = useState<number>(1);
  const [category, setCategory] = useState<string>("");
  const [results, setResults] = useState<PairsResponse[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultElement, setResultElement] = useState<HTMLElement>();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await pairsService.getPares(
        minSupport,
        maxSupport,
        minConfidence,
        maxConfidence,
        category,
      );
      setIsLoading(false);
      setResults(result);
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  const convertImage = (image: any) => {
    return `data:image/jpeg;base64,${Buffer.from(image.data).toString(
      "base64",
    )}`;
  };

  const contentRef = useRef(null);

  const generatePdf = () => {
    const page = document.getElementById("results");
      html2PDF(page!, {
        jsPDF: {
          format: "a4",
        },
        imageType: "image/jpeg",
        output: "./pdf/generate.pdf",
      });
  };


  useEffect(() => {
    const content = document.getElementById("results");
    setResultElement(content!);
  }, [results])

  return (
    <div className="flex flex-col p-4">
      <ToastContainer/>
      <div className="flex justify-center">
        <form className="w-full max-w-3xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col gap-6 border border-amber-100">
          <h2 className="text-2xl font-bold text-amber-600 text-center tracking-tight mb-2 drop-shadow-sm">Параметри пошуку комбінацій</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Мінімальна підтримка</label>
              <input
                className="px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                type="number"
                value={minSupport}
                onChange={(e) => setMinSupport(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Максимальна підтримка</label>
              <input
                className="px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                type="number"
                value={maxSupport}
                onChange={(e) => setMaxSupport(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Мінімальна достовірність</label>
              <input
                className="px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                type="number"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Максимальна достовірність</label>
              <input
                className="px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                type="number"
                value={maxConfidence}
                onChange={(e) => setMaxConfidence(Number(e.target.value))}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
              <select
                className="px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">всі</option>
                {categoriesArray.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <button
              className="px-8 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={handleSubmit}
            >
              Здійснити аналіз
            </button>
          </div>
        </form>
      </div>
      {results && <div className="flex justify-center pt-4">
            <button onClick={generatePdf} className={buttonStyle} type="button">
                Генерувати звіт
            </button>
        </div>}
      <div className="flex flex-col gap-3 py-5" id="results">
        {/* Removed table heading for cleaner look */}
        {(results &&
          ((results.length > 0 && (
            <div className="overflow-x-auto w-full max-w-5xl mx-auto">
              <table className="min-w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-100">
                <thead>
                  <tr className="text-lg text-amber-700 bg-amber-50">
                    <th className="p-4 font-semibold rounded-tl-2xl">Продукт 1</th>
                    <th className="p-4 font-semibold">Продукт 2</th>
                    <th className="p-4 font-semibold">Підтримка</th>
                    <th className="p-4 font-semibold rounded-tr-2xl">Достовірність</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result: PairsResponse, idx: number) => (
                    <tr key={idx} className="even:bg-amber-50/40 hover:bg-amber-100/40 transition">
                      <td className="p-3 border-b border-amber-100">
                        <div className="flex items-center gap-4">
                          <img className="w-16 h-16 object-cover rounded-xl border border-amber-200 bg-white" src={convertImage(result.pair[0].image)} alt={result.pair[0].name} />
                          <span className="font-medium text-gray-800">{result.pair[0].name}</span>
                        </div>
                      </td>
                      <td className="p-3 border-b border-amber-100">
                        <div className="flex items-center gap-4">
                          <img className="w-16 h-16 object-cover rounded-xl border border-amber-200 bg-white" src={convertImage(result.pair[1].image)} alt={result.pair[1].name} />
                          <span className="font-medium text-gray-800">{result.pair[1].name}</span>
                        </div>
                      </td>
                      <td className="p-3 border-b border-amber-100 text-center text-lg text-amber-700 font-semibold">
                        {result.support.toFixed(2)}
                      </td>
                      <td className="p-3 border-b border-amber-100 text-center text-lg text-amber-700 font-semibold">
                        {result.confidence.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )) ||
            (!isLoading && (
              <div className="flex justify-center">
                <div className="mt-16 max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200 px-8 py-8 flex flex-col items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="text-xl font-semibold text-amber-700 text-center">Пари не було знайдено</div>
                  <div className="text-base text-gray-600 text-center">За обраними параметрами не знайдено жодної комбінації товарів, які часто купують разом. Спробуйте змінити параметри пошуку або обрати іншу категорію.</div>
                </div>
              </div>
            )))) || (
          <div className="flex justify-center">
            <div className="mt-16 max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200 px-8 py-8 flex flex-col items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              <div className="text-xl font-semibold text-amber-700 text-center">Щоб побачити результати аналізу комбінацій покупок</div>
              <div className="text-base text-gray-600 text-center">Введіть бажані параметри пошуку та натисніть <span className="font-semibold text-amber-600">"Здійснити аналіз"</span>. Ви отримаєте таблицю з найпоширенішими комбінаціями товарів, які купують разом.</div>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center">
              <UnifiedLoadingScreen label="Завантаження аналітики..." />
          </div>
        )}
      </div>
      <div className="flex justify-center"></div>
    </div>
  );
};

export default PairsPage;
