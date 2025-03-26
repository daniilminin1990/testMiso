/**
 * конфигурацию Webpack для сборки React-приложения с TypeScript. В целом, он написан правильно, но есть несколько синтаксических ошибок и потенциальных улучшений. Давайте разберем его подробно: что он делает и как можно исправить.
 * базовая конфигурация Webpack для сборки фронтенд-приложения с поддержкой TypeScript, React, SCSS/CSS, изображений, шрифтов и других ресурсов
 * Основные компоненты:
    Плагины: Используются для обработки HTML, CSS, окружения (.env), очистки директорий и горячей перезагрузки (HMR).
    Dev Server: Настраивает локальный сервер для разработки с поддержкой маршрутизации (history API) и горячей перезагрузки.
    Модули и загрузчики: Обрабатывают TypeScript/JavaScript (через Babel), стили (CSS/SCSS), изображения, SVG, шрифты и HTML.
    Псевдонимы (aliases): Упрощают импорт модулей с использованием @ префиксов.
    Выходные файлы: Собирает все в директорию build.

 * Ключевые функции:
    Удаляет директорию build перед сборкой и копирует статические файлы из static.
    Генерирует index.html на основе шаблона из public.
    Поддерживает разные режимы (development/production) с соответствующими настройками для CSS и HMR.
    Использует переменные окружения из файла .env (или другого, указанного в envfile).

  Исправить:
    !devMode && new MiniCssExtractPlugin(),
    devMode && new ReactRefreshWebpackPlugin(),
    Это работает, но возвращает false вместо undefined или null, что может привести к проблемам в массиве plugins. Лучше фильтровать массив:
    plugins.filter(Boolean)

  ЗАЧЕМ ТУТ ts-expect-error?
 */

// TODO EDIT MININ Этот ts-check написали для того, чтобы сделать проверку типов (включить тTS. Но ведь можно было сразу сделать формат ts)
// @ts check заставляет TypeScript проверять код на ошибки типов, даже если это JavaScript.
// Без явного указания типа TypeScript будет пытаться вывести тип экспортируемого объекта автоматически, что может привести к неточностям или отсутствию подсказок об ошибках
// @ts-check
"use strict";
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");
import FileManagerPlugin from "filemanager-webpack-plugin";
// TODO EDIT MININ -- если вместо require использовать обычный импорт ESM, то ошибки с типами не будет
// Можно было бы решить и другим способом -
// @type {new (options: { events: { onStart?: any; onEnd?: any } }) => any} (ЭТО ОБОРАЧИВАЕМ В КОММЕНТАРИИ /**  */) (JSDoc комментарий)и пишем const FileManagerPluginConstructor = FileManagerPlugin;
// Так мы явно указываем что FileManagerPlugin - конструктор
// const FileManagerPlugin = require("filemanager-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BUILD_DIR = path.resolve(__dirname, "..", "build");
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const STATIC_DIR = path.resolve(__dirname, "..", "static");

const envfile = process.env.envfile || ".env";
console.log("using env variables: " + envfile);

const devMode = process.env.NODE_ENV !== "production";

// TODO EDIT MININ Эта строка ниже - специальный комментарий JSDoc, используемый в JavaScript с включенной проверкой типов TypeScript (например, через // @ts-check или в .ts файлах)
// ТО есть эта штука работает потому что в начале написано @ts-check (НУ СРАЗУ ЖЕ МОЖНО БЫЛО СДЕЛАТЬ ts файл...)
// А включили ее потому что файл формата JS
// Если вы случайно напишете неверное свойство (например, ouput вместо output) или укажете неправильный тип значения (например, plugins: "string" вместо массива), TypeScript выдаст ошибку, подсказывая, что что-то не так
/** @type {webpack.Configuration["plugins"]} */
const plugins = [
  new FileManagerPlugin({
    events: {
      onStart: { delete: [BUILD_DIR] },
      onEnd: { copy: [{ source: STATIC_DIR, destination: BUILD_DIR }] },
    },
  }),
  new HtmlWebpackPlugin({
    template: path.join(PUBLIC_DIR, "index.html"),
    filename: "index.html",
  }),
  new Dotenv({
    path: `./${envfile}`,
  }),
  !devMode && new MiniCssExtractPlugin(),
  devMode && new ReactRefreshWebpackPlugin(),
];

/** @type {webpack.Configuration["devServer"]} */
const devServer = {
  historyApiFallback: true,
  open: true,
  compress: true,
  allowedHosts: "all",
  hot: true,
  client: {
    overlay: {
      errors: true,
      warnings: true,
    },
  },
  port: 3000,
  devMiddleware: {
    // writeToDisk: true
  },
  static: [],
};

/** @type {webpack.Configuration} */
module.exports = {
  devServer,
  plugins,
  entry: path.join(__dirname, "..", "src", "index.tsx"),
  output: {
    path: BUILD_DIR,
    publicPath: "/",
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".css", ".scss", ".d.ts"],
    // alias: {
    //   "@shared": path.resolve(__dirname, "../src/shared"),
    //   "@entities": path.resolve(__dirname, "../src/entities/"),
    //   "@features": path.resolve(__dirname, "../src/features"),
    //   "@pages": path.resolve(__dirname, "../src/pages"),
    //   "@widgets": path.resolve(__dirname, "../src/widgets"),
    //   "@app": path.resolve(__dirname, "../src/app"),
    //   "@server": path.resolve(__dirname, "../src/server"),
    //   "@defs": path.resolve(__dirname, "../src/types"),
    // },
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
            plugins: [devMode && require.resolve("react-refresh/babel")].filter(
              Boolean
            ),
            cacheDirectory: true,
          },
        },
      },
      { test: /\.html$/, use: ["html-loader"] },
      {
        test: /\.(?:s[ac]|c)ss$/i,
        use: [
          { loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader },
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(?:png|jpe?g|gif|webp|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name].[hash:8].[ext]",
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(?:woff2?|eot|ttf|otf)$/i,
        exclude: /node_modules/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[hash:8].[ext]",
        },
      },
    ],
  },
};

/**
Почему используется в .js, а не .ts?
Ваш файл — это common.config.js, а не TypeScript-файл. В таких случаях:

Использование // @ts-check включает проверку типов в JavaScript.
JSDoc-комментарии, такие как @ type позволяют задавать типы без необходимости переписывать файл на TypeScript.

Если убрать // @ts-check и переименовать файл с common.config.js на common.config.ts, нужно будет адаптировать код к синтаксису TypeScript. Это включает:

Явное указание типов через синтаксис TypeScript вместо JSDoc.
Использование import вместо require (если вы используете ES-модули, что предпочтительно в TypeScript).
Экспорт через export default вместо module.exports.

ЕСЛИ ИЗМЕНИТЬ, ТО ДЛЯ ЗАПУСКА WEBPACK придется указать common.config.ts вместо .js
 */

/**
common.config.ts
import { Configuration } from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import FileManagerPlugin from "filemanager-webpack-plugin";
import Dotenv from "dotenv-webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const BUILD_DIR = path.resolve(__dirname, "..", "build");
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const STATIC_DIR = path.resolve(__dirname, "..", "static");

const envfile = process.env.envfile || ".env";
console.log("using env variables: " + envfile);

const devMode = process.env.NODE_ENV !== "production";

const plugins: Configuration["plugins"] = [
  new FileManagerPlugin({
    events: {
      onStart: { delete: [BUILD_DIR] },
      onEnd: { copy: [{ source: STATIC_DIR, destination: BUILD_DIR }] },
    },
  } as any), // Временное решение для проблемы с типами
  new HtmlWebpackPlugin({
    template: path.join(PUBLIC_DIR, "index.html"),
    filename: "index.html",
  }),
  new Dotenv({
    path: `./${envfile}`,
  }),
  !devMode && new MiniCssExtractPlugin(),
  devMode && new ReactRefreshWebpackPlugin(),
].filter(Boolean);

const devServer: Configuration["devServer"] = {
  historyApiFallback: true,
  open: true,
  compress: true,
  allowedHosts: "all",
  hot: true,
  client: {
    overlay: {
      errors: true,
      warnings: true,
    },
  },
  port: 3000,
  devMiddleware: {
    // writeToDisk: true
  },
  static: [],
};

const config: Configuration = {
  devServer,
  plugins,
  entry: path.join(__dirname, "..", "src", "index.tsx"),
  output: {
    path: BUILD_DIR,
    publicPath: "/",
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".css", ".scss", ".d.ts"],
    alias: {
      "@shared": path.resolve(__dirname, "../src/shared"),
      "@entities": path.resolve(__dirname, "../src/entities/"),
      "@features": path.resolve(__dirname, "../src/features"),
      "@pages": path.resolve(__dirname, "../src/pages"),
      "@widgets": path.resolve(__dirname, "../src/widgets"),
      "@app": path.resolve(__dirname, "../src/app"),
      "@server": path.resolve(__dirname, "../src/server"),
      "@defs": path.resolve(__dirname, "../src/types"),
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
            plugins: [devMode && require.resolve("react-refresh/babel")].filter(Boolean),
            cacheDirectory: true,
          },
        },
      },
      { test: /\.html$/, use: ["html-loader"] },
      {
        test: /\.(?:s[ac]|c)ss$/i,
        use: [
          { loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader },
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(?:png|jpe?g|gif|webp|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name].[hash:8].[ext]",
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(?:woff2?|eot|ttf|otf)$/i,
        exclude: /node_modules/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[hash:8].[ext]",
        },
      },
    ],
  },
};

export default config;
 */
