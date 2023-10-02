# Google Analytics Test

This is a Google Analytics regression testing setup, using [puppeteer](https://github.com/puppeteer/puppeteer) and [cucumber.js](https://github.com/cucumber/cucumber-js). It keeps a record of Google analytics calls using url parameters.

## Dependencies

Node and hopefully nvm

```bash
nvm install 20.3.0
nvm use 20.3.0
```

## Install

```bash
npm install --only=dev
brew install allure
```

Set executablePath to chrome in hook.js

## Instructions`

Run all tests

```bash
source settings/prod.env
npm test
```

Run 1 file.

```bash
./node_modules/cucumber/bin/cucumber-js ./features/fileName.feature -r ./steps
```

You can run a single scenario by adding the line the scenario starts on to the file path.

```bash
./node_modules/cucumber/bin/cucumber-js ./features/fileName.feature:4 -r ./steps
```

## Reports

### Alure Hub

To Run:

```
npm run report
allure generate allure/data/results -o allure/data/reports --clean
allure open allure/data/reports
```

Copy History locally:

```
rm -R allure/data/results/*
cp -R allure/data/reports/history/ allure/data/results/history
```

* Cannot run report in [parallel](https://github.com/cucumber/cucumber-js/issues/1038).

### Junit

For a JUnit Report that can be used in gitlab

```
./node_modules/cucumber/bin/cucumber-js ./features/ -r ./steps -f node_modules/cucumber-junit-formatter:report.xml
```

Or use this formatter.
https://www.npmjs.com/package/cucumber-html-reporter



## Gotchas

If you install node_modules with wrong version of Node, delete the folder and reinstall.
