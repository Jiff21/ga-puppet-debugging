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
  type = type.toLowerCase();
  assert(type == 'category' || type == 'label' || type == 'action' || type == 'title' || type == 'type')
  let title = scope.ga_events[scope.ga_events.length - 1][type];
  try{
    assert(title.includes(text));
  }catch (err){
    console.log('Expected:\n"' + title + '"\nGot:\n"' + text + '"')
  }
})

Then('the last GA event should have the {string} {string}', async function testCase(type, text) {
  type = type.toLowerCase();
  assert(type == 'category' || type == 'label' || type == 'action' || type == 'title' || type == 'type')
  let event_result = scope.ga_events[scope.ga_events.length - 1][type];
  assert(event_result != undefined);
  assert.equal(event_result, text, ['The ', type, text, 'did not match', event_result]);
})

Then('the last GA url should be on {string}', async function testCase(text) {
  let url = scope.ga_events[scope.ga_events.length - 1]['url'];
  text = text.toLowerCase();
  let expectedUrl = scope.host + pages[text];
  try{
    assert(url.includes(expectedUrl));
  }catch (err){
    console.log('Expected:\n"' + expectedUrl + '"\nTo Be part of:\n"' + url + '"')
  }
})
