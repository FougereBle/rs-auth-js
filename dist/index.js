'use strict';

var axios = require('axios');
var Cookie = require('universal-cookie');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var Cookie__default = /*#__PURE__*/_interopDefaultLegacy(Cookie);

var config$1 = {
  apiURL: null,
  loginPath: "/auth/login",
  registerPath: "/auth/register",
  mePath: "/auth/me",
  recoverPasswordPath: "/auth/recover",
  resetPasswordPath: "/auth/reset",
  userVar: "user",
  tokenVar: "token",
  errorVar: "error",
  cookieDuration: 60 * 60 * 24 * 30
};

function createError (err) {
  if (err.response) {
    return {
      error: true,
      response: true,
      code: err.response.status,
      message: err.response.data[config.errorVar]
    };
  } else {
    return {
      error: true,
      response: false,
      code: 409,
      message: "Service Unavailable"
    };
  }
}

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

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

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

      return _catch(function () {
        var token = null;

        if (cookie.get("auth.token")) {
          token = cookie.get("auth.token");
        } else if (process.browser) {
          token = localStorage.getItem("auth.token");
        }

        _this2.setHeader(token);

        return token ? _await(axios__default['default'].get(config$1.apiURL + config$1.mePath), function (response) {
          var user = response.data[config$1.userVar];
          return {
            token: token,
            user: user
          };
        }) : _this2.logout();
      }, function (err) {
        return createError(err);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  },
  login: function login(credentials, rememberMe) {
    try {
      var _this4 = this;

      return _catch(function () {
        return _await(axios__default['default'].post(config$1.apiURL + config$1.loginPath, credentials), function (response) {
          var token = response.data[config$1.tokenVar];

          if (process.browser) {
            localStorage.setItem("auth.token", token);
          }

          if (rememberMe) {
            cookie.set("auth.token", token, {
              maxAge: config$1.cookieDuration
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
      }, function (err) {
        return createError(err);
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
  register: function register(credentials) {
    try {
      return _catch(function () {
        return _await(axios__default['default'].post(config$1.apiURL + config$1.registerPath, credentials), function (response) {
          var user = response.data[config$1.userVar];
          return {
            user: user
          };
        });
      }, function (err) {
        return createError(err);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

function _await$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _catch$1(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

var security = {
  recoverPassword: function recoverPassword(login) {
    try {
      return _catch$1(function () {
        return _await$1(axios__default['default'].post(config$1.apiURL + config$1.recoverPasswordPath, {
          login: login
        }), function () {
          return true;
        });
      }, function (err) {
        return createError(err);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  },
  resetPassword: function resetPassword(code, credentials) {
    try {
      return _catch$1(function () {
        return _await$1(axios__default['default'].post(config$1.apiURL + config$1.resetPasswordPath, {
          code: code,
          credentials: credentials
        }), function () {
          return true;
        });
      }, function (err) {
        return createError(err);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

var sdk = {
  Config: config$1,
  Auth: auth,
  Security: security,
  initialize: function initialize(config) {
    var _this = this;

    Object.keys(config).forEach(function (key) {
      _this.Config[key] = config[key];
    });
  }
};

module.exports = sdk;
