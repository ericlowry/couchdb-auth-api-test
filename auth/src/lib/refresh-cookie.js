//
// lib/refreshCookie.js
//
const REFRESH_TOKEN_COOKIE_NAME = (
  process.env.REFRESH_TOKEN_COOKIE_NAME || 'rt'
).trim();

const REFRESH_TOKEN_COOKIE_DOMAIN = (
  process.env.REFRESH_TOKEN_COOKIE_DOMAIN || 'localhost'
).trim();

const REFRESH_TOKEN_COOKIE_PATH = (
  process.env.REFRESH_TOKEN_COOKIE_PATH || '/auth/'
).trim();

const REFRESH_TOKEN_COOKIE_SECURE = JSON.parse(
  process.env.REFRESH_TOKEN_COOKIE_SECURE || 'false'
);

// Note: use 'none' if SECURE
const REFRESH_TOKEN_COOKIE_SAMESITE = (
  process.env.REFRESH_TOKEN_COOKIE_SAMESITE ||
  (REFRESH_TOKEN_COOKIE_SECURE ? 'none' : 'strict')
).trim();

const REFRESH_TOKEN_DURATION = parseInt(
  process.env.REFRESH_TOKEN_DURATION || '28800' // 8 hours
);

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  domain: REFRESH_TOKEN_COOKIE_DOMAIN,
  path: REFRESH_TOKEN_COOKIE_PATH,
  secure: REFRESH_TOKEN_COOKIE_SECURE,
  sameSite: REFRESH_TOKEN_COOKIE_SAMESITE,
  httpOnly: true,
};

module.exports = {
  //
  // get(req):
  //   gets the refresh token from a request's cookies
  get: (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],

  //
  // set(res,refreshToken):
  //   sets the refresh token into a cookie on the client side
  set: (res, refreshToken) =>
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      ...REFRESH_TOKEN_COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_DURATION * 1000, // in milliseconds
    }),

  //
  // clear(res):
  //   clears the refresh token cookie on the client side
  clear: (res) =>
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS),
};
