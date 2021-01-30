'use strict';

var axios = require('axios');
var Cookie = require('universal-cookie');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var Cookie__default = /*#__PURE__*/_interopDefaultLegacy(Cookie);

var config = {
  apiURL: null,
  loginPath: "/auth/login",
  registerPath: "/auth/register",
  mePath: "/auth/me",
  userVar: "user",
  tokenVar: "token",
  cookieDuration: 60 * 60 * 24 * 30
};

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var cookie = new Cookie__default['default']();
var auth = {
  setHeader: function setHeader(token) {
    if (!token) {
      axios__default['default'].defaults.headers.Authorization = null;
    } else {
      axios__default['default'].defaults.headers.Authorization = "Bearer " + token;
    }
  },
  autoLogin: function autoLogin() {
    try {
      var _this2 = this;

      var token = null;

      if (cookie.get("auth.token")) {
        token = cookie.get("auth.token");
      } else if (process.browser) {
        token = localStorage.getItem("auth.token");
      }

      _this2.setHeader(token);

      if (!token) {
        return _this2.logout();
      }

      return _await(axios__default['default'].get(config.apiURL + config.mePath), function (response) {
        var user = response.data[config.userVar];
        return {
          token: token,
          user: user
        };
      });
    } catch (e) {
      return Promise.reject(e);
    }
  },
  login: function login(credentials, rememberMe) {
    try {
      var _this4 = this;

      return _await(axios__default['default'].post(config.apiURL + config.loginPath, credentials), function (response) {
        var token = response.data[config.tokenVar];

        if (process.browser) {
          localStorage.setItem("auth.token", token);
        }

        if (rememberMe) {
          cookie.set("auth.token", token, {
            maxAge: config.cookieDuration
          });
        }

        return _await(_this4.autoLogin(), function (autoLoginResponse) {
          var user = autoLoginResponse.user;
          return {
            token: token,
            user: user
          };
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  },
  logout: function logout() {
    if (process.browser) {
      localStorage.removeItem("auth.token");
    }

    cookie.remove("auth.token");
    return {
      user: null,
      token: null
    };
  },
  register: function register() {
    try {
      console.log("Not Implemented Yet");
      return _await();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

var sdk = {
  Config: config,
  Auth: auth,
  initialize: function initialize(config) {
    var _this = this;

    Object.keys(config).forEach(function (key) {
      _this.Config[key] = config[key];
    });
  }
};

module.exports = sdk;
