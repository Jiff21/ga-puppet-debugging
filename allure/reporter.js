// //
// var reporter = require('allure-cucumberjs');
// reporter.config({targetDir: "allure/results"});
// module.exports = reporter;
var CucumberJSAllureFormatter = require(allure-cucumberjs).CucumberJSAllureFormatter;
var AllureRuntime = require(allure-cucumberjs).AllureRuntime;

export default class Reporter extends CucumberJSAllureFormatter {
  constructor(options) {
    super(
      options,
      new AllureRuntime({ resultsDir: "./out/allure-results" }),
      {
        labels: {
          issue: [/@bug_(.*)/],
          epic: [/@feature:(.*)/]
        }
      }
    );
  }
}

// I added
// var allure = require(allure-cucumberjs);
// var cucumberjs = require(cucumber);
// To here
// var CucumberJSAllureFormatter = require(allure-cucumberjs).CucumberJSAllureFormatter;
// var AllureRuntime = require(allure-cucumberjs).AllureRuntime;
//
// function Reporter(options) {
//   CucumberJSAllureFormatter.call(this,
//     options,
//     new AllureRuntime({ resultsDir: "./allure/results" }),
//     {});
// }
// Reporter.prototype = Object.create(CucumberJSAllureFormatter.prototype);
// Reporter.prototype.constructor = Reporter;
// exports.default = Reporter;

// https://fullstacker.dev/how-to-write-a-cucumberjs-test-in-es6/
// var reporter = require('cucumber-html-reporter');
//
// var options = {
//   theme: 'bootstrap',
//   jsonFile: 'allure/results/cucumber_report.json',
//   output: 'allure/reports/cucumber_report.html',
//   reportSuiteAsScenarios: true,
//   launchReport: true,
// };
//
// reporter.generate(options);
