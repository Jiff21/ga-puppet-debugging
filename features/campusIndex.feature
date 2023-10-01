@medium @nightly
Feature: Site Name Homepage analytics continue to function

  Scenario: Page Load analytics work
    Given I go to "london"
      And I wait for the footer
    # Pupateer not capturing initial load network calls
      And I go to "index"
      And I reload the page
      And I wait for the footer
    Then the last GA event "type" should include "pageview"
      And the last GA event "title" should include "Google for Startups Campus - A Global Community of Startups"
      And the last GA url should be on "Index"

  Scenario: Social Analytics use correct event category, event action and event label
    Given I go to "index"
    When I click the first social icon
    Then an event has fired where "category" included "Outbound Clicks"
      And an event has fired where "action" included "twitter.com"
      And an event has fired where "label" included "twitter.com/googlestartups"
