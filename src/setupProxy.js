const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {

    app.use(createProxyMiddleware('/api', {

        target: 'https://i.maoyan.com',

        secure: false,

        changeOrigin: true,

        pathRewrite: {

            "^/api": "/api"

        }

    }))

}
// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function (app) {
//     app.use(
//         '/api',
//         createProxyMiddleware({
//             target: 'https://i.maoyan.com',
//             changeOrigin: true,
//         })
//     );
// };
