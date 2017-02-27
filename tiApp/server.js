'use strict';

const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const bundler = webpack(webpackConfig);
const bs = browserSync.create();

bs.init({
  logPrefix: 'AMT',
  server: {
    baseDir: [
      'dist',
    ],
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true}
      }),

      // bundler should be the same as above
      webpackHotMiddleware(bundler)
    ]
  },
});

var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('./mock/mock.json')
var middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(3005, function () {
  console.log('-------JSON Server is running---------')
})
