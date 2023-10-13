const puppeteer = require('puppeteer');
const { Given, When, Then } = require('cucumber');
var assert = require('assert');

const pages = require('./support/pages');
const scope = require('./support/scope');

// Page Locator map
const search_selector = 'input[aria-label=Search]';
const click_selector = 'input[type="submit"]';
const all_results_links = 'div#search h3';
const footer_selector = 'footer'

let checkSupportedParameters = (text)=> {
  eventValue = [
    'name',
    'title',
    'link_url',
    'url',
    'percent_scrolled'
  ]
  assert(eventValue.includes(text))
}

let normalizeParameterType = (text)=> {
  return text.toLowerCase().replace(' ', '_')
}


Given('I go to {string}', { timeout: 60 * 1000 }, async function testCase(page) {
  const url = scope.host + pages[page];
  console.debug('Going to ', url);
  await scope.context.page.goto(url, {waitUntil: 'load'})
  // await scope.context.page.goto(url, {waitUntil: 'networkidle2'})
})

Given('I reload the page', { timeout: 60 * 1000 }, async function testCase() {
  await scope.context.page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
})

Then('an event has fired where {string} included {string}', async function testCase(type, text) {
  assert(scope.ga_events.length > 0)
  type = normalizeParameterType(type);
  // console.debug('Looking for a GA event of this type: ' + type)
  checkSupportedParameters(type);
  let x = 0, event;
  var truethyness = false;
  for (x; x < scope.ga_events.length; x++){
    // console.debug('Keys are ' + Object.keys(scope.ga_events[x]))
    event = scope.ga_events[x];
    try{
      if (event[type].includes(text)){
        truethyness = true;
      }
    } catch{
      // console.info(event['name'] + ' did not have the parameter ' + type);
      continue;
    }
  }
  assert(truethyness);
})


Then('the last GA event {string} should include {string}', {wrapperOptions: { retry: 2 }, timeout: 60 * 1000 }, async function testCase(type, text,) {
  assert(scope.ga_events.length > 0)
  type = normalizeParameterType(type);
  checkSupportedParameters(type);
  let title = scope.ga_events[scope.ga_events.length - 1][type];
  assert(title.includes(text));
})

Then('the last GA event should have the {string} {string}', async function testCase(type, text) {
  assert(scope.ga_events.length > 0)
  type = normalizeParameterType(type);
  checkSupportedParameters(type);
  let event_result = scope.ga_events[scope.ga_events.length - 1][type];
  assert(event_result != undefined);
  assert.equal(event_result, text, ['The ', type, text, 'did not match', event_result]);
})

Then('the last GA url should be on {string}', async function testCase(text) {
  assert(scope.ga_events.length > 0)
  let url = scope.ga_events[scope.ga_events.length - 1]['url'];
  text = text.toLowerCase();
  let expectedUrl = scope.host + pages[text];
  assert(url.includes(expectedUrl));
})

// Names are globally unique, seems to not care if you use this as a When too.
Given('I wait {int} seconds', { timeout: 60 * 1000 }, async function testCase(number) {
  let wait = number * 1000;
  await scope.context.page.waitForTimeout(wait);
})

When('I enter {string}', async function testCase(text) {
  await scope.context.page.waitForSelector(search_selector);
  await scope.context.page.type(search_selector, text);
})

When('I wait for the footer', async function testCase() {
  await scope.context.page.waitForSelector(footer_selector);
})

// When('I get data layer', {wrapperOptions: { retry: 2 }, timeout: 60 * 1000 }, async function testCase() {
//   page.on('window.dataLayer._push', request => console.info());
//   const snapshot = await scope.context.page.accessibility.snapshot();
//   console.info(snapshot);
// })

When('I get accessible elements', {timeout: 60 * 1000}, async function testCase() {
  const snapshot = await scope.context.page.accessibility.snapshot();
  console.info(snapshot);
})

When('I look at page load times', {timeout: 60 * 1000}, async function testCase() {
  const metrics = await scope.context.page.evaluate(() => JSON.stringify(window.performance));
  // console.info(JSON.parse(metrics));
  let json_m = JSON.parse(metrics);
  const loadTime = Number(json_m['timing']['domComplete']) - Number(json_m['timing']['responseStart']);
  console.info(loadTime);
})

When('I get accessible elements', {timeout: 60 * 1000}, async function testCase() {
  const snapshot = await scope.context.page.accessibility.snapshot();
  console.info(snapshot);
})

// Can define a retry on flaky steps
When('I click submit', {wrapperOptions: { retry: 2 }, timeout: 60 * 1000 }, async function testCase() {
  await scope.context.page.waitForSelector(click_selector);
  // await scope.context.page.click('input[type="submit"]')
  // Working around click error.
  await scope.context.page.evaluate((click_selector)=>
    document.querySelector('input[type="submit"]').click()
  )
})

Then('I should see {string}', async function testCase(text) {
  await scope.context.page.waitForSelector(all_results_links);
  const links = await scope.context.page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('div#search h3'))
    return anchors.map(anchor => anchor.textContent)
  })
  // console.log(links.join('\n'))
  var el = links.find(link =>link.includes(text));
  assert(el != undefined);
  // Single string would be
  // assert(links.includes(text));
  // This fixes undefined but not actually woorking
  // const links = await scope.context.page.evaluate((all_results_links) => {
  //   const anchors = Array.from(document.querySelectorAll(all_results_links))
  //   return anchors.map(anchor => anchor.textContent)
  // })
  // console.log(links.join('\n'))
  // console.log(text)
})
