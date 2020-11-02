/*eslint no-console: ["error", { allow: ["log"] }] */
// Dependencies
const { After, Before, AfterAll, Status} = require('cucumber');
let scope = require('./support/scope');

const cleanUrl = (text)=> {
  text = decodeURIComponent(text);
  return text.replace(/\+/g, '%20');
}

const getGaType = (obj)=> {
  const match_pattern = '&t=([^&]+)';
  return obj.url().match(match_pattern)[1];
}

const getGaTitle = (obj)=> {
  const match_pattern = '[?&]dt=([^&]+)';
  title = obj.url().match(match_pattern)[1];
  return cleanUrl(title);
}

const getGaPageUrl = (obj)=> {
  const match_pattern = 'dl=([^&]+)';
  title = obj.url().match(match_pattern)[1];
  return cleanUrl(title);
}

const getGaEventCategory = (obj)=> {
  const match_pattern = '[?&]ec=([^&]+)';
  category = obj.url().match(match_pattern)[1];
  return cleanUrl(category);
}

const getGaEventAction = (obj)=> {
  const match_pattern = '[?&]ea=([^&]+)';
  action = obj.url().match(match_pattern)[1];
  return cleanUrl(action);
}

const getGaEventLabel = (obj)=> {
  const match_pattern = '[?&]el=([^&]+)';
  label = obj.url().match(match_pattern)[1];
  return cleanUrl(label);
}

// Here is where you might clean up database tables to have a clean slate before the tests run
Before(async () => {
  /* configurable options or object for puppeteer */
  const opts = {
      headless: false,
      slowMo: 1,
      timeout: 0,
      args: [
        '--start-maximized',
        '--disable-plugins',
        '--disable-instant-extended-api'
      ]
      // args: ['--start-maximized', '--window-size=1920,1040']
  }
  // Chrome is set to run headlessly and with no slowdown in CircleCI
  if (process.env.CIRCLECI) headless = true;
  if (process.env.CIRCLECI) slowMo = 2;

  const pending = callback => {
    callback(null, 'pending');
  };


  if (!scope.browser)
    scope.browser = await scope.driver.launch(opts);
  scope.context.page = await scope.browser.newPage();
  scope.context.page.setViewport({ width: 1280, height: 1024 });

  // Set up a list of Goole Analytics Events
  scope.ga_events = [];
  let i = 0;
  scope.context.page.on('request', request => {
    if(request.url().includes('google-analytics.com/collect?')){
      // console.debug(request.url())
      let type = getGaType(request)
      // console.debug(type)
      if (type.includes('pageview')){
        scope.ga_events[i] = {
          'type' : 'pageview'
        }
        // console.debug(scope.ga_events[i])
      }else if (type.includes('event')){
        ecMatch = getGaEventCategory(request);
        eaMatch = getGaEventAction(request);
        elMatch = getGaEventLabel(request);
        scope.ga_events[i] = {
          'category' : ecMatch,
          'action' : eaMatch,
          'label' : elMatch,
          'type' : 'event'
        }
      }else{
        console.log('Unknown Event Type');
        assert(false);
      }
      let pageTitle = getGaTitle(request);
      scope.ga_events[i].title = pageTitle;
      let pageUrl =   getGaPageUrl(request);
      scope.ga_events[i].url = pageUrl;
      i += 1;
    };
  });
});

// Here we clean up the browser session
After(async (feature) => {
  if (scope.browser && scope.context.page) {
    if (feature.result.status === Status.FAILED) {
      name = feature.pickle.name.replace(/\s+/g, '-').toLowerCase()
      await scope.context.page.screenshot({
        path: './screenshots/failures/' + name + '.png'
      })
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
