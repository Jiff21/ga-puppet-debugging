@medium
Feature: Site Name Homepage analytics continue to function

  Scenario: This is a scenario
    Given I go to "index"
    Then the last GA event "title" should include "Google for Startups Campus - A Global Community of Startups"
    When I click the first social icon
    Then The last GA event should have the "category" "Outbound Clicks"
      And The last GA event should have the "action" "twitter.com"
      And The last GA event should have the "label" "twitter.com/googlestartups/"
