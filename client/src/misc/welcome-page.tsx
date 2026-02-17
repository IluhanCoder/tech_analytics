import UnifiedLoadingScreen from "../components/UnifiedLoadingScreen";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import $api, { dropHeader } from "../axios-setup";
import { Link } from "react-router-dom";
import { buttonStyle } from "../styles/button-styles";
import UnregistratedPage from "./unregistrated-page";
import { cardStyle } from "../styles/card-styles";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies<any>([]);
  const [username, setUsername] = useState<string | undefined>();
  const [isAuth, setIsAuth] = useState<boolean>();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuth(false);
        return;
      }
      const { data } = await $api.post("/", {token});
      const { status, user } = data;
      setUsername(user);
      setIsAuth(true);
      return status
        ? console.log("hello user")
        : (removeCookie("token"), navigate("/login"));
    };
    verifyToken();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    localStorage.removeItem("token");
    dropHeader();
    navigate("/signup");
  };

  if (isAuth !== undefined)
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 bg-gradient-to-br from-white to-amber-50">
        <section className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-amber-100 mt-24">
          {(isAuth && (
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-3xl font-extrabold text-amber-600 text-center tracking-tight drop-shadow-sm mb-2">Вітаємо, {username ?? "анонім"}!</h1>
              <div className="text-lg text-gray-700 text-center mb-2">
                Ви увійшли до системи аналітики продажів для магазину комп'ютерної техніки.<br/>
                Тут ви можете:
              </div>
              <ul className="text-base text-gray-700 mb-4 list-disc list-inside">
                <li>Аналізувати продажі за різними періодами</li>
                <li>Отримувати прогнози попиту на товари</li>
                <li>Виявляти найпопулярніші комбінації покупок</li>
                <li>Експортувати звіти у PDF</li>
              </ul>
              <div className="flex flex-col gap-2 w-full">
                <Link to="/analytics" className="w-full">
                  <button className="w-full px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition">Перейти до аналітики</button>
                </Link>
                <Link to="/prediction" className="w-full">
                  <button className="w-full px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition">Прогноз попиту</button>
                </Link>
                <Link to="/pairs" className="w-full">
                  <button className="w-full px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition">Аналіз комбінацій покупок</button>
                </Link>
              </div>
              <div className="mt-4">
                <button type="button" className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold shadow transition" onClick={Logout}>
                  Вийти з облікового запису
                </button>
              </div>
            </div>
          )) || <UnregistratedPage />}
        </section>
      </main>
    );
  else
    return (
      <div className="flex flex-col justify-center">
        <UnifiedLoadingScreen label="Завантаження..." />
      </div>
    );
};

export default WelcomePage;
