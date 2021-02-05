import config from "../config";
import createError from "../helpers/error";
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
    try {
      let token = null;

      if (cookie.get("authtoken")) {
        token = cookie.get("authtoken");
      } else if (process.browser) {
        token = localStorage.getItem("authtoken");
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
    } catch (err) {
      return createError(err);
    }
  },
  async login(credentials, rememberMe) {
    try {
      const response = await axios.post(
        config.apiURL + config.loginPath,
        credentials
      );
      const token = response.data[config.tokenVar];

      if (process.browser) {
        localStorage.setItem("authtoken", token);
      }

      if (rememberMe) {
        cookie.set("authtoken", token, {
          maxAge: config.cookieDuration,
        });
      }

      const autoLoginResponse = await this.autoLogin();
      const user = autoLoginResponse.user;

      return {
        token,
        user,
      };
    } catch (err) {
      return createError(err);
    }
  },
  logout() {
    if (process.browser) {
      localStorage.removeItem("authtoken");
    }

    cookie.remove("authtoken");

    return {
      user: null,
      token: null,
    };
  },
  async register(credentials) {
    try {
      const response = await axios.post(
        config.apiURL + config.registerPath,
        credentials
      );

      const user = response.data[config.userVar];

      return {
        user,
      };
    } catch (err) {
      return createError(err);
    }
  },
};
