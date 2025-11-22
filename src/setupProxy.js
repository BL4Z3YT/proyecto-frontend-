const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxy explícito para redirigir llamadas de la app de desarrollo (CRA)
// hacia el backend en http://localhost:4000.
// Cubre todas las rutas bajo /api/*, incluyendo caracteres con tilde.
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      ws: true,
      logLevel: 'silent',
    })
  );
};