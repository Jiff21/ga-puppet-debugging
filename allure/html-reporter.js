var reporter = require('cucumber-html-reporter');

var options = {
  theme: 'bootstrap',
  jsonFile: 'allure/results/cucumber_report.json',
  output: 'allure/reports/cucumber_report.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
};

reporter.generate(options);
