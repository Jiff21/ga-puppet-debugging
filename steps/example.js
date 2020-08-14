const puppeteer = require('puppeteer');
const { Given, When, Then } = require('cucumber');

const pages = require('./support/pages');
const scope = require('./support/scope');


Given('I am on google with puppeteer', { timeout: 60 * 1000 }, async function testCase() {
  const url = scope.host + pages.home;
  await scope.context.page.goto('https://google.com', {waitUntil: 'networkidle2'})
  // await page.goto('https://google.com', {waitUntil: 'networkidle2'})
})

When('I enter {string}', async function testCase(text) {
  await scope.context.page.waitFor('input[aria-label=Search]')
  await scope.context.page.type('input[aria-label=Search]', text)
  // await scope.context.page.click('input[type="submit"]')
})

When('I click submit', { timeout: 60 * 1000 }, async function testCase() {
  await scope.context.page.waitFor('input[type="submit"')
  await scope.context.page.click('input[type="submit"]')
  // Working around click error.
  await scope.context.page.evaluate(()=>document.querySelector('input[type="submit"]').click())
})

Then('I should see {string}', async function testCase(text) {
  await scope.context.page.waitForSelector('div#search h3')

  const links = await scope.context.page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('div#search h3'))
    return anchors.map(anchor => anchor.textContent)
  })

  console.log(links.join('\n'))
  console.log(text)
})
