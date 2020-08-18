@medium @nightly
Feature: Site Name Homepage analytics continue to function

  Scenario: Page Load analytics work
    Given I go to "index"
    Then the last GA event "type" should include "pageview"
      And the last GA event "title" should include "Google for Startups Campus - A Global Community of Startups"
      And the last GA url should be on "Index"

  Scenario: Social Analytics use correct event category, event action and event label
    Given I go to "index"
    When I click the first social icon
    Then the last GA event should have the "category" "Outbound Clicks"
      And the last GA event should have the "action" "twitter.com"
      And the last GA event should have the "label" "twitter.com/googlestartups/"
