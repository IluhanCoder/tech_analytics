
import "./App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import WelcomePage from "./misc/welcome-page";
import ProductsPage from "./products/products-page";
import NewProductPage from "./products/new-product-page";
import SignupPage from "./auth/signup-page";
import LoginPage from "./auth/login-page";
import NewTransactionPage from "./transactions/new-transaction-page";
import { registerLocale } from "react-datepicker";
import uk from "date-fns/locale/uk";
import TransactionsPage from "./transactions/transactions-page";
import AnalyticsPage from "./analytics/analytics-page";
import AnalyticsCategoriesPage from "./analytics/analytics-categories-page";
import PredictionPage from "./prediction/prediction-page";
import PairsPage from "./pairs/pairs-page";
import { useEffect } from "react";
import { setHeader } from "./axios-setup";
registerLocale("ua", uk);

const navLinks = [
  { to: "/products", label: "Каталог", icon: "🖥️" },
  { to: "/new-product", label: "Новий товар", icon: "➕" },
  { to: "/transactions", label: "Замовлення", icon: "🛒" },
  { to: "/prediction", label: "Прогноз", icon: "📊" },
  { to: "/analytics", label: "Аналітика", icon: "📈" },
  { to: "/analytics-categories", label: "Категорії", icon: "🧩" },
  { to: "/pairs", label: "Комбінації", icon: "🔗" },
  { to: "/", label: "Обліковий запис", icon: "👤" },
];

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex bg-background-light">
      <aside className="hidden md:flex flex-col w-64 bg-white/90 backdrop-blur-md shadow-xl py-10 px-6 border-r border-gray-100">
        <div className="mb-12 text-2xl font-extrabold tracking-tight text-gray-900 select-none">
          Tech Store <span className="text-amber-500">Analytics</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navLinks.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center px-5 py-3 rounded-xl text-base font-semibold transition-colors
                  ${active ? "bg-amber-50 text-amber-700" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 rounded-full bg-amber-400" />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-0 md:p-4 bg-background-light">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    if (localStorage.getItem("token")) setHeader();
  }, []);

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route index element={<WelcomePage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="new-product" element={<NewProductPage />} />
          <Route path="new-transaction" element={<NewTransactionPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="analytics-categories" element={<AnalyticsCategoriesPage />} />
          <Route path="prediction" element={<PredictionPage />} />
          <Route path="pairs" element={<PairsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
