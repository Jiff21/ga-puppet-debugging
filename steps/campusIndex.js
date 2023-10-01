const puppeteer = require('puppeteer');
const { Given, When, Then } = require('cucumber');
var assert = require('assert');

const pages = require('./support/pages');
const scope = require('./support/scope');

// Page Locator map
const first_social = '.glue-social__link';

// Can define a retry on flaky steps
When('I click the first social icon', {wrapperOptions: { retry: 2 }, timeout: 60 * 1000 }, async function testCase() {
  await scope.context.page.waitFor(first_social);
  await scope.context.page.click(first_social);
})
