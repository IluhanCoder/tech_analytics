
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { credentials } from "./auth-types";
import authService from "./auth-service";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<credentials>({
    email: "",
    username: "",
    password: "",
    passwordSub: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOnChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputValue((values) => ({ ...values, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!inputValue.username?.trim()) {
      newErrors.username = "Ім'я користувача не може бути порожним";
    } else if (inputValue.username.length < 3) {
      newErrors.username = "Ім'я користувача має бути мінімум 3 символи";
    }

    if (!inputValue.email?.trim()) {
      newErrors.email = "Електронна пошта не може бути порожною";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.email)) {
      newErrors.email = "Введіть коректну електронну пошту";
    }

    if (!inputValue.password?.trim()) {
      newErrors.password = "Пароль не може бути порожним";
    } else if (inputValue.password.length < 6) {
      newErrors.password = "Пароль має бути мінімум 6 символів";
    }

    if (!inputValue.passwordSub?.trim()) {
      newErrors.passwordSub = "Підтвердження пароля не може бути порожним";
    } else if (inputValue.password !== inputValue.passwordSub) {
      newErrors.passwordSub = "Паролі не співпадають";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await authService.SignUp(inputValue);
      toast.success("Реєстрація успішна! Перенаправляння...");
      setTimeout(() => navigate("/"), 1500);
    } catch(error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Помилка реєстрації";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <ToastContainer />
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col gap-6 border border-gray-100"
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="text-5xl">💻</div>
          <h1 className="text-3xl font-extrabold text-gray-900">Реєстрація</h1>
          <p className="text-sm text-gray-500 text-center">Створіть новий обліковий запис у Tech Store Analytics</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Ім'я користувача</label>
          <input
            className={`rounded-xl border px-4 py-2.5 text-base focus:outline-none focus:ring-2 transition ${
              errors.username
                ? "border-red-300 focus:ring-red-200 bg-red-50"
                : "border-gray-300 focus:ring-amber-200 bg-white"
            }`}
            type="text"
            name="username"
            placeholder="Введіть ім'я користувача"
            value={inputValue.username}
            onChange={handleOnChange}
            autoComplete="username"
          />
          {errors.username && <span className="text-sm text-red-500 mt-1">{errors.username}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Електронна пошта</label>
          <input
            className={`rounded-xl border px-4 py-2.5 text-base focus:outline-none focus:ring-2 transition ${
              errors.email
                ? "border-red-300 focus:ring-red-200 bg-red-50"
                : "border-gray-300 focus:ring-amber-200 bg-white"
            }`}
            type="email"
            name="email"
            placeholder="you@email.com"
            value={inputValue.email}
            onChange={handleOnChange}
            autoComplete="email"
          />
          {errors.email && <span className="text-sm text-red-500 mt-1">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Пароль</label>
          <input
            className={`rounded-xl border px-4 py-2.5 text-base focus:outline-none focus:ring-2 transition ${
              errors.password
                ? "border-red-300 focus:ring-red-200 bg-red-50"
                : "border-gray-300 focus:ring-amber-200 bg-white"
            }`}
            type="password"
            name="password"
            placeholder="Введіть пароль"
            value={inputValue.password}
            onChange={handleOnChange}
            autoComplete="new-password"
          />
          {errors.password && <span className="text-sm text-red-500 mt-1">{errors.password}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Підтвердження пароля</label>
          <input
            className={`rounded-xl border px-4 py-2.5 text-base focus:outline-none focus:ring-2 transition ${
              errors.passwordSub
                ? "border-red-300 focus:ring-red-200 bg-red-50"
                : "border-gray-300 focus:ring-amber-200 bg-white"
            }`}
            type="password"
            name="passwordSub"
            placeholder="Повторіть пароль"
            value={inputValue.passwordSub}
            onChange={handleOnChange}
            autoComplete="new-password"
          />
          {errors.passwordSub && <span className="text-sm text-red-500 mt-1">{errors.passwordSub}</span>}
        </div>

        <button
          className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Реєстрація..." : "Зареєструватися"}
        </button>

        <div className="flex justify-center gap-1 text-sm mt-2">
          <span className="text-gray-600">Вже є обліковий запис?</span>
          <Link className="text-amber-600 hover:underline font-medium" to="/login">
            Увійти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
