const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('framework', resolve('./src/plugin/Framework'))
  },
  devServer: {
    open: true,
    proxy: {
      [process.env.VUE_APP_BASEURL]: {
        target: process.env.VUE_APP_BASEURL, // API服务器的地址
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/foo': {
        target: 'http://yd.abc.top'
      }
    }
  }
}
