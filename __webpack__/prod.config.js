// @ts-check
"use strict";
const { merge } = require("webpack-merge");
const common = require("./common.config.js");

/** @type {import("webpack").Configuration} */
const prodConfig = {
  mode: "production", // Режим продакшена для оптимизаций
  target: "web",
  devtool: false, // Отключаем source maps для продакшена (или "source-map" для отладки)
  output: {
    filename: "[name].[contenthash].js", // Хэширование для кэширования
    chunkFilename: "[name].[contenthash].js", // Для динамических чанков
  },
  optimization: {
    minimize: true, // Включить минификацию (по умолчанию в mode: "production")
    splitChunks: {
      chunks: "all", // Оптимизация разделения кода
    },
  },
};

module.exports = merge(common, prodConfig);
