const puppeteer = require('puppeteer');
const { Given, When, Then } = require('cucumber');
var assert = require('assert');

const pages = require('./support/pages');
const scope = require('./support/scope');

// Page Locator map
const search_selector = 'input[aria-label=Search]';
const click_selector = 'input[type="submit"]';
const all_results_links = 'div#search h3';


Given('I go to {string}', { timeout: 60 * 1000 }, async function testCase(page) {
  const url = scope.host + pages[page];
  // console.debug('Going to ', url)
  await scope.context.page.goto(url, {waitUntil: 'networkidle2'})
})

// Names are globally unique, seems to not care if you use this as a When too.
Given('I wait {int} seconds', { timeout: 60 * 1000 }, async function testCase(number) {
  let wait = number * 1000;
  await scope.context.page.waitFor(wait);
})

When('I enter {string}', async function testCase(text) {
  await scope.context.page.waitFor(search_selector);
  await scope.context.page.type(search_selector, text);
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
  await scope.context.page.waitFor(click_selector);
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
  // This fixes undefined but not acutually woorking
  // const links = await scope.context.page.evaluate((all_results_links) => {
  //   const anchors = Array.from(document.querySelectorAll(all_results_links))
  //   return anchors.map(anchor => anchor.textContent)
  // })
  // console.log(links.join('\n'))
  // console.log(text)
})
