const puppeteer = require('puppeteer');
const { Given, When, Then } = require('cucumber');
var assert = require('assert');

const pages = require('./support/pages');
const scope = require('./support/scope');

// Page Locator map
const first_social = '.h-c-social__item';

// Can define a retry on flaky steps
When('I click the first social icon', {wrapperOptions: { retry: 2 }, timeout: 60 * 1000 }, async function testCase() {
  await scope.context.page.waitFor(first_social);
  await scope.context.page.click(first_social);
})

Then('the last GA event {string} should include {string}', async function testCase(type, text) {
  let title = scope.ga_events[scope.ga_events.length - 1][type];
  try{
    assert(title.includes(text));
  }catch (err){
    console.log('Expected:\n"' + title + '"\nGot:\n"' + text + '"')
  }
})

Then('The last GA event should have the category {string}', async function testCase(text) {
  let category = scope.ga_events[scope.ga_events.length - 1]['category'];
  assert.equal(category, text, ['The category ' + text + ' did not match '  + category]);
})

Then('The last GA event should have the action {string}', async function testCase(text) {
  let action = scope.ga_events[scope.ga_events.length - 1]['action'];
  assert.equal(action, text, [action]);
})

Then('The last GA event should have the label {string}', async function testCase(text) {
  let label = scope.ga_events[scope.ga_events.length - 1]['label'];
  assert.equal(label, text, [label]);
})
