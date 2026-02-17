
import React, { useState, useEffect } from "react";
import UnifiedLoadingScreen from "../components/UnifiedLoadingScreen";
import { AnalyticsResult } from "./analytics-types";
import analyticsService from "./analytics-service";
import { convertAnalyticsForGraphs } from "./analytics-helpers";
import AnalyticsGraph from "./analytics-graph";
import ReactDatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";


const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
  // Default range: from one year ago to today
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  const [startDate, setStartDate] = useState<Date>(oneYearAgo);
  const [endDate, setEndDate] = useState<Date>(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getData = async (start: Date, end: Date) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyticsService.getAnalyticsData(start, end);
      setAnalytics(result);
    } catch (e) {
      setError("Не вдалося завантажити аналітику");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(startDate, endDate);
    // eslint-disable-next-line
  }, []);

  const handleStart = (date: Date) => {
    if (date >= endDate) return;
    setStartDate(date);
    getData(date, endDate);
  };
  const handleEnd = (date: Date) => {
    if (date <= startDate) return;
    setEndDate(date);
    getData(startDate, date);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 bg-gradient-to-br from-white to-amber-50">
      <section className="w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-amber-100">
        <h1 className="text-4xl font-extrabold text-amber-600 text-center tracking-tight mb-2 drop-shadow-sm">
          Аналітика продажів
        </h1>
        <div className="flex flex-col md:flex-row gap-6 md:items-end items-center justify-between">
          <div className="flex-1 w-full flex flex-col justify-end">
            <label className="block text-sm font-medium text-gray-700 mb-1">Діапазон дат</label>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Від</span>
                <ReactDatePicker
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                  selected={startDate}
                  onChange={handleStart}
                  locale={"ua"}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">До</span>
                <ReactDatePicker
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 bg-white/80 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                  selected={endDate}
                  onChange={handleEnd}
                  locale={"ua"}
                />
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <UnifiedLoadingScreen label="Завантаження аналітики..." />
        ) : error ? (
          <div className="text-red-500 text-center font-medium">{error}</div>
        ) : analytics ? (
          <div className="flex flex-col gap-8">
            <div>
              <div className="text-center text-xl font-semibold mb-2">Щомісячна сума продажів</div>
              <AnalyticsGraph
                data={convertAnalyticsForGraphs(analytics).monthlyTransactionSum.data}
                name={convertAnalyticsForGraphs(analytics).monthlyTransactionSum.name}
              />
            </div>
            <div>
              <div className="text-center text-xl font-semibold mb-2">Середня сума замовлення за місяць</div>
              <AnalyticsGraph
                data={convertAnalyticsForGraphs(analytics).averageTransactions.data}
                name={convertAnalyticsForGraphs(analytics).averageTransactions.name}
              />
            </div>
            <div>
              <div className="text-center text-xl font-semibold mb-2">Кількість транзакцій за місяць</div>
              <AnalyticsGraph
                data={convertAnalyticsForGraphs(analytics).monthlyTransactionAmount.data}
                name={convertAnalyticsForGraphs(analytics).monthlyTransactionAmount.name}
              />
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default AnalyticsPage;
