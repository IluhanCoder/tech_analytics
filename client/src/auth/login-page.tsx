import { useState } from "react";
import { credentials } from "./auth-types";
import $api, { setHeader } from "../axios-setup";
import { cardStyle } from "../styles/card-styles";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle } from "../styles/button-styles";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { smallLinkStyle } from "../styles/link-styles";

const LoginPage = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<credentials>({
    email: "",
    password: "",
  });

  const handleOnChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputValue((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = (await $api.post("/login", inputValue)).data;
      localStorage.setItem("token", token);
      setHeader();
      navigate("/");
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background-light py-8">
      <form
        onChange={handleOnChange}
        className="w-full max-w-md bg-background-light rounded-2xl shadow-card p-8 flex flex-col gap-6 border border-gray-200"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="text-4xl">🔐</div>
          <div className="text-2xl font-extrabold text-gray-900">Вхід в обліковий запис</div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Електронна пошта</label>
          <input
            className="input"
            type="email"
            name="email"
            placeholder="you@email.com"
            value={inputValue.email}
            onChange={handleOnChange}
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Пароль</label>
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Введіть пароль"
            value={inputValue.password}
            onChange={handleOnChange}
            autoComplete="current-password"
          />
        </div>
        <button
          className="w-full py-3 mt-2 rounded-lg bg-background-light text-gray-900 font-bold text-lg border border-gray-300 shadow-button hover:bg-gray-100 transition-colors"
          type="button"
          onClick={handleSubmit}
        >
          Увійти
        </button>
        <div className="flex justify-center gap-1 text-sm mt-2">
          <span className="text-gray-600">Немає облікового запису?</span>
          <Link className="text-accent-dark hover:underline" to="/signup">
            Зареєструватися
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
