//
// setupProxy.js -  create a development environment proxy
//                  (between the client and the server)
//
// Note: this proxy doesn't appear in the production build.
//
const { createProxyMiddleware } = require('http-proxy-middleware');

const AUTH_PROXY = process.env.AUTH_PROXY || 'http://localhost:3001';
const API_PROXY = process.env.API_PROXY || 'http://localhost:3002';

module.exports = (app) => {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: AUTH_PROXY,
      changeOrigin: true,
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: API_PROXY,
      changeOrigin: true,
    })
  );
};
