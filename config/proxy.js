/**
 * 代理
 */
let host = {
  dev: 'https://dev.yltapi.com',
}[process.env.REACT_APP_ENV];

export default {
  '/api': {
    target: host,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    }
  },
}
