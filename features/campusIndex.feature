@medium @nightly
Feature: Site Name Homepage analytics continue to function

  Scenario: Page Load analytics work
    Given I go to "index"
      And I wait for the footer
    Then the last GA event "name" should include "pageview"

  Scenario: Social Analytics use correct event category, event action and event label
    Given I go to "index"
    When I click the first social icon
    Then an event has fired where "name" included "Outbound Clicks"
