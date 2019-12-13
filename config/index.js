// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var config = {
  devbuild: {
    // test
    assetsRoot: path.resolve(__dirname, '../devdist'),
    // assetsPublicPath: 'http://static.uyingbet.com/',
    index: path.resolve(__dirname, '../devdist/index.html')
  },
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/xy95': {
            target: 'https://www.ds95.net/',
            changeOrigin: true,
            pathRewrite: {
              '^/xy95': ''
            }
        },
        '/xy49': {
            target: 'http://192.168.169.49:9901/',
            changeOrigin: true,
            pathRewrite: {
              '^/xy49': ''
            }
        },
        '/xytest': {
            target: 'https://www.xy-test.net/',
            changeOrigin: true,
            pathRewrite: {
              '^/xytest': ''
            }
        },
        '/xy_activity': {
            target: 'http://192.168.169.49/',
            changeOrigin: true,
            pathRewrite: {
              '^/xy_activity': '/xy_activity'
            }
        },
        '/lg_egame': {
            target: 'http://192.168.169.49/',
            changeOrigin: true,
            pathRewrite: {
              '^/lg_egame': '/lg_egame'
            }
        },
        '/pt_egame': {
            target: 'http://192.168.169.49/',
            changeOrigin: true,
            pathRewrite: {
              '^/pt_egame': '/pt_egame'
            }
        }
    },
    productionSourceMap: true,
    devtool: 'cheap-module-eval-source-map',
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

if (process.env.NODE_ENV_BUILD) {
    config.build = Object.assign(config.build, config[process.env.NODE_ENV_BUILD])
}
module.exports = config
