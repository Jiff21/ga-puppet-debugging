// //
// var reporter = require('allure-cucumberjs');
// reporter.config({targetDir: "../allure/results"});
// module.exports = reporter;
// 
// var allure = require(allure-cucumberjs);
// var cucumberjs = require(cucumber);
// var CucumberJSAllureFormatter = require(allure-cucumberjs).CucumberJSAllureFormatter;
// var AllureRuntime = require(allure-cucumberjs).AllureRuntime;
//
// function Reporter(options) {
//   CucumberJSAllureFormatter.call(
//     this,
//     options,
//     new AllureRuntime({ resultsDir: "./allure/results" }),
//     {});
// }
//
// Reporter.prototype = Object.create(CucumberJSAllureFormatter.prototype);
// Reporter.prototype.constructor = Reporter;
// exports.default = Reporter;

//
// export default class Reporter extends CucumberJSAllureFormatter {
//   constructor(options) {
//     super(
//       options,
//       new AllureRuntime({ resultsDir: "./allure/results" }),
//       {
//         labels: {
//           issue: [/@bug_(.*)/],
//           epic: [/@feature:(.*)/]
//         }
//       }
//     );
//   }
// }
