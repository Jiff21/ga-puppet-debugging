# Google Analytics Test

This is a Google Analytics regression testing setup, using (puppeteer)[https://github.com/puppeteer/puppeteer] and (cucumber.js)[https://github.com/cucumber/cucumber-js]. It keeps a record of Google analytics calls using url parameters.

## Install

```bash
npm install --only=dev
```

## Instructions

Run all tests

```bash
npm test
```

Run 1 file.

```bash
./node_modules/cucumber/bin/cucumber-js ./features/fileName.feature -r ./steps
```


## Alure Hub
https://github.com/allure-framework/allure-js/blob/master/packages/allure-cucumberjs/README.md
