// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/component-class-suffix": "off",
      "@angular-eslint/component-selector": "off",
      "@angular-eslint/directive-class-suffix": "off",
      "@angular-eslint/directive-selector": "off",
      "@angular-eslint/no-outputs-metadata-property": "off",
      "@angular-eslint/no-output-rename": "off",
      "@angular-eslint/no-input-rename": "off"
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended
    ],
    rules: {},
  }
);
