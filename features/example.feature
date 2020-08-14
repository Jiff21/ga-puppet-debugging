Feature: Example

  Scenario: This is a scenario
    Given I am on google with puppeteer
    When I enter "cucumber.js"
      And I click submit
    Then I should see "cucumber"
