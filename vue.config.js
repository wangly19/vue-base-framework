const path = require('path')

// 获取当前路径
function resolve (dir) {
  return path.join(__dirname, dir)
}

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  assetsDir: 'static',
  lintOnSave: true,
  filenameHashing: true,
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: config => {
    config.externals = {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios'
    }
  },
  chainWebpack: config => {
    config.when(!isDev, config => {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        args[0].terserOptions.compress.drop_debugger = true
        args[0].terserOptions.compress.pure_funcs = ['console.log']
        args[0].terserOptions.output = {
          comments: false
        }
        return args
      })
    })
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.exclude.add(/node_modules/)
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('framework', resolve('./src/plugin/Framework'))

    const cdn = {
      js: [
        '//unpkg.com/vue@2.6.10/dist/vue.min.js',
        '//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js',
        '//unpkg.com/vuex@3.1.1/dist/vuex.min.js',
        '//unpkg.com/axios@0.19.0/dist/axios.min.js'
      ]
    }
    config.plugin('html').tap(args => {
      // html中添加cdn
      args[0].cdn = cdn
      return args
    })
  },
  productionSourceMap: !isDev,
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
      }
    }
  }
}
