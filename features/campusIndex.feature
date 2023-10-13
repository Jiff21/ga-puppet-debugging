@medium @nightly
Feature: Site Name Homepage analytics continue to function

  Scenario: Page Load analytics work
    Given I go to "index"
      And I wait for the footer
    Then an event has fired where "name" included "pageview"
      And an event has fired where "title" included "Google for Startups Campus - A Global Community of Startups"

  Scenario: Social buttons tracked as outbound click
    Given I go to "index"
    When I click the first social icon
    Then an event has fired where "name" included "outbound_click"
      And an event has fired where "link url" included "twitter.com"

  Scenario: Clicking on the Google Logo fires and outbound click
    Given I go to "index"
    When I click the Google logo in the footer
    Then an event has fired where "name" included "outbound_click"
      And an event has fired where "title" included "Google for Startups Campus - A Global Community of Startups"

  Scenario: The Index pages loads in under 2 seconds
    Given I go to "index"
    When I look at page load times
    Then the page load time should less than 2 seconds