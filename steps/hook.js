/*eslint no-console: ["error", { allow: ["log"] }] */
// Dependencies
const { After, Before, AfterAll, Status} = require('cucumber');
const scope = require('./support/scope');

// Here is where you might clean up database tables to have a clean slate before the tests run
Before(async () => {
  // Defines whether puppeteer runs Chrome in headless mode.
  let headless = false;
  let slowMo = 0;
  // Chrome is set to run headlessly and with no slowdown in CircleCI
  if (process.env.CIRCLECI) headless = true;
  if (process.env.CIRCLECI) slowMo = 2;

  const pending = callback => {
    callback(null, 'pending');
  };


  if (!scope.browser)
    scope.browser = await scope.driver.launch({ headless, slowMo });
  scope.context.page = await scope.browser.newPage();
  scope.context.page.setViewport({ width: 1280, height: 1024 });

});

// Here we clean up the browser session
After(async (feature) => {
  if (scope.browser && scope.context.page) {
    if (feature.result.status === Status.FAILED) {
      name = feature.pickle.name.replace(/\s+/g, '-').toLowerCase()
      await scope.context.page.screenshot({ path: './screenshots/failures/' + name + '.png'})
    }
    const cookies = await scope.context.page.cookies();
    if (cookies && cookies.length > 0) {
      await scope.context.page.deleteCookie(...cookies);
    }
    await scope.context.page.close();
    scope.context.page = null;
  }
});

AfterAll(async () => {
  if (scope.browser) await scope.browser.close();
  // If you have your API and Web servers running, you can shut them down afterwards
  // scope.api.shutdown(() => console.log('\nAPI is shut down'));
  // scope.web.shutdown(() => console.log('Web is shut down'));
});
