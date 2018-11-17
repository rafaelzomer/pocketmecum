/* eslint-disable camelcase */

'use strict';

const path               = require('path');
const webpack            = require('webpack');
const merge              = require('webpack-merge');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const pkg = require('./package.json');

const config = process.env.NODE_ENV !== 'production' ?
  require('./webpack.dev.config') :
  require('./webpack.prod.config');

const localIdentName = process.env.NODE_ENV !== 'production' ?
  '[path]__[name]__[local]__[hash:base64:5]' :
  '[hash:base64:5]';

const common = {
  bail : true,
  entry: {
    vendor: Object.keys(pkg.dependencies),
    bundle: './src/index.js'
  },
  output: {
    path: path.resolve('dist')
  },
  module: {
    rules: [
      {
        test   : /\.js$/,
        use    : 'babel-loader',
        exclude: path.join(__dirname, 'node_modules')
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use : [
          'style-loader',
          {
            loader : 'css-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        use : [
          {
            loader : 'file-loader',
            options: {
              name : '[name]-[hash].[ext]',
              limit: 10000
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs'
    }),
    new WebpackPwaManifest({
      name            : 'Pocketmecum',
      icons           : [],
      short_name      : 'Pocketmecum',
      description     : 'O vademecum de bolso!',
      background_color: '#000000'
    })
  ]
};

module.exports = merge.smart(common, config);
