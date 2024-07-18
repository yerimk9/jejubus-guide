const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api1", // 프록시가 필요한 경로
    createProxyMiddleware({
      target: "http://busopen.jeju.go.kr", // 타겟 API 서버의 기본 URL
      changeOrigin: true,
    })
  );
  app.use(
    "/api2",
    createProxyMiddleware({
      target: "http://bus.jeju.go.kr",
      changeOrigin: true,
    })
  );
  app.use(
    "/googleMap",
    createProxyMiddleware({
      target: "https://maps.googleapis.com",
      changeOrigin: true,
      secure: false,
    })
  );
};
