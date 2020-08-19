# Google Analytics Test

This is a Google Analytics regression testing setup, using (puppeteer)[https://github.com/puppeteer/puppeteer] and (cucumber.js)[https://github.com/cucumber/cucumber-js]. It keeps a record of Google analytics calls using url parameters.

## Dependencies

Node and hopefully nvm

```bash
nvm install 10.16.3
nvm use 10.16.3
```

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

## Gotchas

If you install node_modules with wrong version of Node, delete the folder and reinstall.


## Alure Hub
https://github.com/allure-framework/allure-js/blob/master/packages/allure-cucumberjs/README.md
