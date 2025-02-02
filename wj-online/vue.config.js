const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const timeStamp = new Date().getTime()

module.exports = {
  devServer: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    // 		pathRewrite: {
    // 			'^/api': '/api'
    // 		}
    //   }
    // }
  },
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
        'utils': '@/utils'
      }
    },

    // output和css 添加时间戳，自动清除缓存
    output: {
      filename: `js/[name].${timeStamp}.js`,
      chunkFilename: `js/[name].${timeStamp}.js`
    }
  },

  // css: {
  //   extract: {
  //     filename: `css/[name].${timeStamp}.css`,
  //     chunkFilename: `css/[name].${timeStamp}.css`,
  //   }
  // },

  chainWebpack: config => {
    //  发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

      config.set('externals', {
        vue: "Vue",
        axios: "axios",
        lodash: "_",
        nprogress: "NProgress",
        'vue-router': "VueRouter"
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}