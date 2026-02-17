import $api, { setHeader } from "../axios-setup";
import { credentials } from "./auth-types";
export default new (class AuthService {
  async SignUp(credentials: credentials) {
    const response = (await $api.post("/signup", { ...credentials })).data;
    // Якщо токен повертається із signup, зберігаємо його одразу
    if (response.token) {
      localStorage.setItem("token", response.token);
      setHeader();
    }
    return response;
  }

  async login(inputValue: credentials) {
    const token = (await $api.post("/login", inputValue)).data;
    return token;
  }
})();
