import config from "../config";
import createError from "../helpers/error";
import axios from "axios";

export default {
  async recoverPassword(login) {
    try {
      await axios.post(config.apiURL + config.recoverPasswordPath, {
        login,
      });

      return true;
    } catch (err) {
      return createError(err);
    }
  },
  async resetPassword(code, credentials) {
    try {
      await axios.post(config.apiURL + config.resetPasswordPath, {
        code,
        credentials,
      });

      return true;
    } catch (err) {
      return createError(err);
    }
  },
};
