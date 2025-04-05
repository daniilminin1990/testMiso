const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  roots: ["../tests", "../src"],
  moduleNameMapper: {
    "^@components(.*)": "<rootDir>/../src/components/$1",
    "^@assets(.*)": "<rootDir>/../src/assets/$1",
    "^@helpers(.*)": "<rootDir>/../src/helpers/$1",
    "^@hooks(.*)": "<rootDir>/../src/hooks/$1",
    "^@defs(.*)": "<rootDir>/../src/types/$1",
    "^@/pages(.*)": "<rootDir>/../src/pages/$1",
    "^@routes(.*)": "<rootDir>/../src/routes/$1"
  },
  transform: {
    ...tsjPreset.transform,
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform" // To work with CSS like modules
  },
  testEnvironment: "jsdom"
};
