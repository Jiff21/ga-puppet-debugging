"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;


var allure = require(allure-cucumberjs);
var cucumberjs = require(cucumberjs);
var CucumberJSAllureFormatter = require(allure-cucumberjs).CucumberJSAllureFormatter;
var AllureRuntime = require(allure-cucumberjs).AllureRuntime;

class Reporter extends CucumberJSAllureFormatter {
  constructor(options) {
    super(options, new AllureRuntime({
      resultsDir: "./out/allure-results"
    }), {
      labels: {
        issue: [/@bug_(.*)/],
        epic: [/@feature:(.*)/]
      }
    });
  }

}

exports.default = Reporter;
