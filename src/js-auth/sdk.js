import config from "./config";
import auth from "./auth/auth";

export default {
  Config: config,
  Auth: auth,
  initialize(config) {
    Object.keys(config).forEach((key) => {
      this.Config[key] = config[key];
    });
  },
};
