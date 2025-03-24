// @ts-check
"use strict";
const { merge } = require("webpack-merge");
const common = require("./common.config.js");

module.exports = merge(common, {
  mode: "development",
  target: "web",
  devtool: "eval-source-map",
  output: {
    filename: "[name].[contenthash].js",
  },
});

// МОЖНО БЫЛО УЛУЧШИТЬ
// С синтаксисом ниже TypeScript будет знать, что common это webpack.Configuration
/**

// @ts-check
'use strict';
const { merge } = require("webpack-merge");
const common = require("./common.config.js");

 [@ type {import("webpack").Configuration}] -- это вместо [] обернуть в кавычки для многострочных комментов
const devConfig = {
    mode: "development",
    target: "web",
    devtool: "eval-source-map",
    output: {
      filename: "[name].[contenthash].js",
    },
  };
  
  module.exports = merge(common, devConfig);
 */
