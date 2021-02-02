import config from "./config";
import auth from "./auth/auth";
import security from "./auth/security";

export default {
  Config: config,
  Auth: auth,
  Security: security,
  initialize(config) {
    Object.keys(config).forEach((key) => {
      this.Config[key] = config[key];
    });
  },
};
