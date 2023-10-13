/*eslint no-console: ["error", { allow: ["log"] }] */
// Dependencies
const { After, Before, AfterAll, Status} = require('cucumber');
const { connect } = require('puppeteer');
let scope = require('./support/scope');

const cleanUrl = (text)=> {
  text = decodeURIComponent(text);
  return text.replace(/\+/g, '%20');
}

const getEventName = (obj)=> {
  // console.debug("Getting event name");
  const match_pattern = '&en=([^&]+)';
  return obj.url().match(match_pattern)[1];
}

const checkforEventName = (obj)=> {
  const match_pattern = '&en=([^&]+)';
  return obj.url().match(match_pattern)
}

const getPageViewEventName = (obj)=> {
  const match_pattern = '&t=([^&]+)';
  let pageViewEvent = obj.url().match(match_pattern);
  if (pageViewEvent != null) {
    // console.debug('setting pageViewEvent');
    return pageViewEvent[1]
  }
}

const getPercentScrollled = (obj)=> {
  const match_pattern = '&ep\.percent_scrolled=([^&]+)';
  let scrollPercent = obj.url().match(match_pattern);
  if (scrollPercent != null) {
    // console.debug('setting scrollPercent');
    return scrollPercent[1]
  }
}

const getGaTitle = (obj)=> {
  const match_pattern = '[?&]dt=([^&]+)';
  title = obj.url().match(match_pattern)[1];
  return cleanUrl(title);
}

const getGaPageUrl = (obj)=> {
  const match_pattern = 'dl=([^&]+)';
  pageUrl = obj.url().match(match_pattern);
  if (pageUrl != null) {
    return cleanUrl(pageUrl[1]);
  }
}

const getLinkUrl = (obj)=> {
  const match_pattern = '&ep\.link_url=([^&]+)';
  linkUrl = obj.url().match(match_pattern);
  if (linkUrl != null) {
    // console.debug('setting linkURL');
    return cleanUrl(linkUrl[1]);
  }
}


// Here is where you might clean up database tables to have a clean slate before the tests run
Before(async () => {
  /* configurable options or object for puppeteer */
  const opts = {
    args: [
        '--disable-dev-shm-usage',
        '--disable-infobars',
        '--disable-instant-extended-api',
        '--disable-plugins',
        '--disable-setuid-sandbox',
        '--enable-feature=NetworkService',
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--start-maximized'
      ],
      dumpio: true,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: false,
      ignoreHTTPSErrors: true,
      slowMo: 1,
      timeout: 0
  }

  // abiliy to pass Headless from command line.
  if (process.env.HEADLESS)
    opts['headless'] = true;
    opts['slowMo'] = 2;

  // Chrome is set to run headlessly and with no slowdown in CircleCI
  if (process.env.CircleCI)
    opts['headless'] = true;
    opts['slowMo'] = 2;

  const pending = callback => {
    callback(null, 'pending');
  };

  if (!scope.browser)
    scope.browser = await scope.driver.launch(opts);
  // This works to open a single page.
  // scope.context.page = await scope.browser.targets()[scope.browser.targets().length-1].page();
  // But opening 2 tabs helps avoid a freeze sometimes according to comments
  scope.context.page = await scope.browser.newPage();
  scope.context.page.setViewport({ width: 1280, height: 1024 });

  // Set up a list of Goole Analytics Events
  scope.ga_events = [];
  let i = 0;
  await scope.context.page.setRequestInterception(true);
  scope.context.page.on('request', request => {
    if (!request.url().includes('google-analytics.com') || !request.url().includes('collect?') ) {
      request.continue();
    } else if (checkforEventName(request) == null) {
      // console.debug('Name only event')
      let name = getPageViewEventName(request);
      scope.ga_events[i] = {'name' : name}
      i += 1;
      request.continue()
    } else {
      // console.debug('Has Event Name')
      let name = getEventName(request);
      scope.ga_events[i] = {
        'name' : name,
      }
      // get scroll percentage if it exists
      let percentScrolled = getPercentScrollled(request);
      scope.ga_events[i].percent_scrolled = percentScrolled;
      // get title if it exist
      let pageTitle = getGaTitle(request);
      scope.ga_events[i].title = pageTitle;
      // get page url from event
      let pageUrl = getGaPageUrl(request);
      scope.ga_events[i].url = pageUrl;
      let linkUrl = getLinkUrl(request);
      scope.ga_events[i].link_url = linkUrl;
      i += 1;
      request.continue()
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
