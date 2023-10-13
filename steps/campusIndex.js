const puppeteer = require('puppeteer');
const { Given, When, Then } = require('cucumber');
var assert = require('assert');

const pages = require('./support/pages');
const scope = require('./support/scope');

// Page Locator map
const first_social = '.glue-social__link';
const google_footer_logo = 'a[aria-label="Google"]'

// Can define a retry on flaky steps
When('I click the first social icon', {wrapperOptions: { retry: 2 }, timeout: 60 * 1000 }, async function testCase() {
  await scope.context.page.waitForSelector(first_social);
  await scope.context.page.click(first_social);
})

When('I click the Google logo in the footer', {wrapperOptions: { retry: 2 }, timeout: 4000 }, async function testCase() {
  await scope.context.page.waitForSelector(first_social);
  await scope.context.page.click(first_social);
})
