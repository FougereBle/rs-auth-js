import config from "../config";
import axios from "axios";
import Cookie from "universal-cookie";

const cookie = new Cookie();

export default {
  setHeader(token) {
    if (!token) {
      axios.defaults.headers.Authorization = null;
    } else {
      axios.defaults.headers.Authorization = "Bearer " + token;
    }
  },
  async autoLogin() {
    let token = null;

    if (cookie.get("auth.token")) {
      token = cookie.get("auth.token");
    } else if (process.browser) {
      token = localStorage.getItem("auth.token");
    }

    this.setHeader(token);

    if (!token) {
      return this.logout();
    }

    const response = await axios.get(config.apiURL + config.mePath);
    const user = response.data[config.userVar];

    return {
      token,
      user,
    };
  },
  async login(credentials, rememberMe) {
    const response = await axios.post(
      config.apiURL + config.loginPath,
      credentials
    );
    const token = response.data[config.tokenVar];

    if (process.browser) {
      localStorage.setItem("auth.token", token);
    }

    if (rememberMe) {
      cookie.set("auth.token", token, {
        maxAge: config.cookieDuration,
      });
    }

    const autoLoginResponse = await this.autoLogin();
    const user = autoLoginResponse.user;

    return {
      token,
      user,
    };
  },
  logout() {
    if (process.browser) {
      localStorage.removeItem("auth.token");
    }

    cookie.remove("auth.token");

    return {
      user: null,
      token: null,
    };
  },
  async register() {
    console.log("Not Implemented Yet");
  },
};
