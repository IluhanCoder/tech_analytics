
import { useState } from "react";
import { credentials } from "./auth-types";
import authService from "./auth-service";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<credentials>({
    email: "",
    username: "",
    password: "",
    passwordSub: "",
  });

  const handleOnChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputValue((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if(!(inputValue.email.length > 0 && inputValue.username?.length! > 0 && inputValue.password.length > 0 && inputValue.passwordSub?.length! > 0)) {
        toast.error("всі поля мають бути заповненими");
        return
      }
      if(inputValue.password != inputValue.passwordSub) {
        toast.error("поля пароль та підтвердження пароля не співпадають");
        return
      }
      toast("обробка запиту...");
     await authService.SignUp(inputValue);
     navigate("/");
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background-light py-8">
      <ToastContainer />
      <form
        onChange={handleOnChange}
        className="w-full max-w-md bg-background-light rounded-2xl shadow-card p-8 flex flex-col gap-6 border border-gray-200"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="text-4xl">📝</div>
          <div className="text-2xl font-extrabold text-gray-900">Реєстрація</div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Ім'я користувача</label>
          <input
            className="input"
            type="text"
            name="username"
            placeholder="Введіть ім'я користувача"
            value={inputValue.username}
            onChange={handleOnChange}
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Електронна пошта</label>
          <input
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            type="email"
            name="email"
            placeholder="you@email.com"
            value={inputValue.email}
            onChange={handleOnChange}
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Пароль</label>
          <input
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            type="password"
            name="password"
            placeholder="Введіть пароль"
            value={inputValue.password}
            onChange={handleOnChange}
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Підтвердження пароля</label>
          <input
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            type="password"
            name="passwordSub"
            placeholder="Повторіть пароль"
            value={inputValue.passwordSub}
            onChange={handleOnChange}
            autoComplete="new-password"
          />
        </div>
        <button
          className="w-full py-3 mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg transition-colors"
          type="button"
          onClick={handleSubmit}
        >
          Зареєструватися
        </button>
        <div className="flex justify-center gap-1 text-sm mt-2">
          <span className="text-gray-600 dark:text-gray-300">Вже є обліковий запис?</span>
          <Link className="text-indigo-600 hover:underline dark:text-indigo-400" to="/login">
            Увійти
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
