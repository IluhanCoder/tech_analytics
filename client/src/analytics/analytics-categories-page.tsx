import React, { useEffect, useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import UnifiedLoadingScreen from "../components/UnifiedLoadingScreen";
import transactionService from "../transactions/transaction-service";
import { TransactionResponse, PurchaseResponse } from "../transactions/transaction-types";
import categoriesArray from "../misc/categories-array";

const palette = [
  "#f59e0b",
  "#f97316",
  "#ea580c",
  "#fbbf24",
  "#fb923c",
  "#fdba74",
  "#fcd34d",
  "#fed7aa",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);

const formatMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const formatMonthLabel = (key: string) => {
  const [year, month] = key.split("-");
  return `${month}.${year}`;
};

const normalizeCategory = (category?: string) =>
  category && category.trim().length > 0 ? category.trim() : "Інше";

const normalizeCategoryKey = (category?: string) =>
  normalizeCategory(category).toLocaleLowerCase("uk");

const AnalyticsCategoriesPage: React.FC = () => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [startDate, setStartDate] = useState<Date>(oneYearAgo);
  const [endDate, setEndDate] = useState<Date>(today);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (start: Date, end: Date) => {
    setLoading(true);
    setError(null);
    try {
      const dateFilter = {
        date: {
          gte: start,
          lte: end,
        },
      };
      const result = await transactionService.fetchTransactions(dateFilter, "");
      setTransactions(result || []);
    } catch (e) {
      setError("Не вдалося завантажити аналітику по категоріях");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
    // eslint-disable-next-line
  }, []);

  const categoryMeta = useMemo(() => {
    const labelByKey = new Map<string, string>();
    categoriesArray.forEach((category) => {
      labelByKey.set(normalizeCategoryKey(category), normalizeCategory(category));
    });
    transactions.forEach((transaction) => {
      transaction.products.forEach((product: PurchaseResponse) => {
        if (!product.product) return;
        const label = normalizeCategory(product.product.category);
        const key = normalizeCategoryKey(label);
        if (!labelByKey.has(key)) labelByKey.set(key, label);
      });
    });
    const list = Array.from(labelByKey.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "uk"));
    return { list, labelByKey };
  }, [transactions]);

  const categoryStats = useMemo(() => {
    const stats = new Map<
      string,
      { key: string; label: string; revenue: number; quantity: number; orderIds: Set<string> }
    >();

    transactions.forEach((transaction) => {
      transaction.products.forEach((purchase: PurchaseResponse) => {
        if (!purchase.product) return;
        const label = normalizeCategory(purchase.product.category);
        const key = normalizeCategoryKey(label);
        const revenue = purchase.product.price * purchase.quantity;
        if (!stats.has(key)) {
          stats.set(key, {
            key,
            label: categoryMeta.labelByKey.get(key) ?? label,
            revenue: 0,
            quantity: 0,
            orderIds: new Set<string>(),
          });
        }
        const entry = stats.get(key);
        if (!entry) return;
        entry.revenue += revenue;
        entry.quantity += purchase.quantity;
        entry.orderIds.add(transaction.id);
      });
    });

    const filtered = Array.from(stats.values()).map((entry) => ({
      key: entry.key,
      label: entry.label,
      revenue: entry.revenue,
      quantity: entry.quantity,
      orders: entry.orderIds.size,
    }));

    if (selectedCategories.length === 0) return filtered;
    return filtered.filter((item) => selectedCategories.includes(item.key));
  }, [transactions, selectedCategories, categoryMeta.labelByKey]);

  const revenueByCategory = useMemo(() => {
    return [...categoryStats].sort((a, b) => b.revenue - a.revenue);
  }, [categoryStats]);

  const totalRevenue = useMemo(
    () => revenueByCategory.reduce((sum, item) => sum + item.revenue, 0),
    [revenueByCategory],
  );

  const totalQuantity = useMemo(
    () => revenueByCategory.reduce((sum, item) => sum + item.quantity, 0),
    [revenueByCategory],
  );

  const activeCategories = useMemo(() => {
    if (selectedCategories.length > 0) return selectedCategories;
    return revenueByCategory.slice(0, 5).map((item) => item.key);
  }, [selectedCategories, revenueByCategory]);

  const monthKeys = useMemo(() => {
    const keys: string[] = [];
    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endCursor = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    while (cursor <= endCursor) {
      keys.push(formatMonthKey(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return keys;
  }, [startDate, endDate]);

  const monthlyRevenueData = useMemo(() => {
    const base = monthKeys.reduce((acc, key) => {
      acc[key] = { name: formatMonthLabel(key) } as Record<string, number | string>;
      activeCategories.forEach((category) => {
        acc[key][category] = 0;
      });
      return acc;
    }, {} as Record<string, Record<string, number | string>>);

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const key = formatMonthKey(date);
      if (!base[key]) return;
      transaction.products.forEach((purchase: PurchaseResponse) => {
        if (!purchase.product) return;
        const categoryKey = normalizeCategoryKey(purchase.product.category);
        if (!activeCategories.includes(categoryKey)) return;
        base[key][categoryKey] =
          (base[key][categoryKey] as number) + purchase.product.price * purchase.quantity;
      });
    });

    return monthKeys.map((key) => base[key]);
  }, [transactions, activeCategories, monthKeys]);

  const monthlyQuantityData = useMemo(() => {
    const base = monthKeys.reduce((acc, key) => {
      acc[key] = { name: formatMonthLabel(key) } as Record<string, number | string>;
      activeCategories.forEach((category) => {
        acc[key][category] = 0;
      });
      return acc;
    }, {} as Record<string, Record<string, number | string>>);

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const key = formatMonthKey(date);
      if (!base[key]) return;
      transaction.products.forEach((purchase: PurchaseResponse) => {
        if (!purchase.product) return;
        const categoryKey = normalizeCategoryKey(purchase.product.category);
        if (!activeCategories.includes(categoryKey)) return;
        base[key][categoryKey] = (base[key][categoryKey] as number) + purchase.quantity;
      });
    });

    return monthKeys.map((key) => base[key]);
  }, [transactions, activeCategories, monthKeys]);

  const handleStart = (date: Date) => {
    if (date >= endDate) return;
    setStartDate(date);
    fetchData(date, endDate);
  };

  const handleEnd = (date: Date) => {
    if (date <= startDate) return;
    setEndDate(date);
    fetchData(startDate, date);
  };

  const toggleCategory = (categoryKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((item) => item !== categoryKey)
        : [...prev, categoryKey],
    );
  };

  const legendFormatter = (value: string) => categoryMeta.labelByKey.get(value) ?? value;

  const clearCategories = () => setSelectedCategories([]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 bg-gradient-to-br from-white via-amber-50 to-orange-100">
      <section className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col gap-8 border border-amber-100">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-amber-600 text-center tracking-tight drop-shadow-sm">
            Аналітика по категоріях
          </h1>
          <p className="text-center text-sm text-gray-500">
            Виберіть період та категорії, щоб побачити розподіл продажів.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">Діапазон дат</label>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Від</span>
                <ReactDatePicker
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 bg-white/90 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                  selected={startDate}
                  onChange={handleStart}
                  locale={"ua"}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">До</span>
                <ReactDatePicker
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 bg-white/90 focus:ring-2 focus:ring-amber-400 focus:outline-none transition text-base shadow-sm"
                  selected={endDate}
                  onChange={handleEnd}
                  locale={"ua"}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-amber-50/60 rounded-2xl border border-amber-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Категорії</span>
              <button
                type="button"
                onClick={clearCategories}
                className="text-xs text-amber-700 hover:text-amber-900 transition"
              >
                Очистити
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categoryMeta.list.map((category) => (
                <label
                  key={category.key}
                  className="flex items-center gap-2 text-sm text-gray-700 bg-white/80 rounded-xl px-3 py-2 border border-amber-100 shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.key)}
                    onChange={() => toggleCategory(category.key)}
                    className="accent-amber-500"
                  />
                  <span className="truncate">{category.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <UnifiedLoadingScreen label="Завантаження аналітики..." />
        ) : error ? (
          <div className="text-red-500 text-center font-medium">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/90 border border-amber-100 rounded-2xl p-4 shadow-sm">
                <div className="text-xs uppercase text-gray-500">Виручка</div>
                <div className="text-2xl font-bold text-amber-700">
                  {formatCurrency(totalRevenue)}
                </div>
              </div>
              <div className="bg-white/90 border border-amber-100 rounded-2xl p-4 shadow-sm">
                <div className="text-xs uppercase text-gray-500">Продано одиниць</div>
                <div className="text-2xl font-bold text-amber-700">{totalQuantity}</div>
              </div>
              <div className="bg-white/90 border border-amber-100 rounded-2xl p-4 shadow-sm">
                <div className="text-xs uppercase text-gray-500">Активних категорій</div>
                <div className="text-2xl font-bold text-amber-700">
                  {revenueByCategory.length}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/70 border border-amber-100 rounded-2xl p-4 shadow-sm">
                <div className="text-center text-lg font-semibold mb-3">Виручка по категоріях</div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={revenueByCategory} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#fde68a" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/70 border border-amber-100 rounded-2xl p-4 shadow-sm">
                <div className="text-center text-lg font-semibold mb-3">Частка виручки</div>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={revenueByCategory}
                      dataKey="revenue"
                      nameKey="label"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={4}
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={entry.key} fill={palette[index % palette.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend layout="horizontal" verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/70 border border-amber-100 rounded-2xl p-4 shadow-sm lg:col-span-2">
                <div className="text-center text-lg font-semibold mb-3">Динаміка виручки по місяцях</div>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={monthlyRevenueData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#fde68a" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend formatter={legendFormatter} />
                    {activeCategories.map((categoryKey, index) => (
                      <Line
                        key={categoryKey}
                        type="monotone"
                        dataKey={categoryKey}
                        stroke={palette[index % palette.length]}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/70 border border-amber-100 rounded-2xl p-4 shadow-sm lg:col-span-2">
                <div className="text-center text-lg font-semibold mb-3">Кількість продажів по місяцях</div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={monthlyQuantityData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#fde68a" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend formatter={legendFormatter} />
                    {activeCategories.map((categoryKey, index) => (
                      <Bar
                        key={categoryKey}
                        dataKey={categoryKey}
                        stackId="sales"
                        fill={palette[index % palette.length]}
                        radius={[6, 6, 0, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default AnalyticsCategoriesPage;
