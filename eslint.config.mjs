// @ts-check
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
// import { pluginUnicorn } from 'eslint-plugin-unicorn';
// import { pluginPrettierRecommended } from 'eslint-plugin-prettier/recommended';

import reactRefresh from "eslint-plugin-react-refresh"; //* @type {Record<string, import('typescript-eslint').FlatConfig.Rule>}
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config({
  files: ["src/**/*.{js,jsx,cjs,ts,tsx}"],
  extends: [
    pluginJs.configs.recommended,
    tseslint.configs.eslintRecommended,
    // ...tseslint.configs.all,
    // ...tseslint.configs.strict /* TypeChecked */,
    // ...tseslint.configs.stylistic,
    pluginReact.configs.flat["jsx-runtime"],
    // eslintPluginUnicorn.configs['flat/recommended'],
    // eslintPluginPrettierRecommended,
    reactRefresh.configs.recommended,
  ],
  plugins: {
    "react-compiler": reactCompiler,
    // TODO: https://github.com/facebook/react/pull/38774
  },
  languageOptions: {
    globals: globals.browser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  settings: {
    react: {
      version: "detect", // React version. "detect" automatically picks the version you have installed.
      defaultVersion: "17", // Default React version to use when the version cannot be detected.
    },
  },
  rules: {
    // TODO: https://github.com/facebook/react/pull/38774
    "react-compiler/react-compiler": "error",

    // @ts-expect-error
    .../** @type {Record<string, import('typescript-eslint').FlatConfig.Rule>} */ (
      reactHooks.configs.recommended.rules
    ),

    "capitalized-comments": "off",
    // ****** Ошибка Object literal may only specify known properties, and 'capitalized-comments' does not exist in type 'InfiniteDepthConfigWithExtends'.ts(2353)
    // Возникает потому что добавляю правила в объект, возвращаемый из tseslint.config(). Однако метод tseslint.config() ожидает, что я укажу правила в специальном свойстве rules, а не напрямую в корне объекта конфигурации
    // Решение - перенести в rules
    curly: "off",
    "id-length": "off",
    "new-cap": "off",
    "no-console": "off",
    "no-inline-comments": "off",
    "no-undefined": "off",
    "prefer-template": "off",
    "sort-imports": "off",
    "sort-keys": "off",
    "func-style": "off",

    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",

    // consider adopt
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-non-nulll-assertion": "off",
    "@typescript-eslint/no-unsafe-type-assertion": "off",
    "@typescript-eslint/prefer-destructuring": "off",
    "@typescript-eslint/prefer-readonly-parameter-types": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",

    // turned off from 'all'
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
    "@typescript-eslint/ban-tslint-comment": "off",
    "@typescript-eslint/class-methods-use-this": "off",
    "@typescript-eslint/init-declarations": "off",
    "@typescript-eslint/max-params": "off",
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/no-magic-numbers": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/parameter-properties": "off",
    "@typescript-eslint/promise-functions-async": "off",

    // 'unicorn/prevent-abbreviations': 'off'

    //configures
    "no-return-await": "off",
    "@typescript-eslint/return-await": ["error", "always"],

    // 'unicorn/better-regex': 'warn'

    "@typescript-eslint/no-empty-object-type": [
      "warn",
      { allowInterfaces: "with-single-extends" },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/method-signature-style": "error",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowNumber: true, allowBoolean: true /* allowNullish: true */ },
    ],
    "react/jsx-sort-props": [
      "warn",
      {
        reservedFirst: true,
        // shortHandFirst: true
        // callbackLast: true
        noSortAlphabetically: true,
      },
    ],
    "react/jsx-no-unless-fragment": "error",
  },
});
