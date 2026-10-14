---
title: "Why Burrow uses AI to suggest rules"
description: "Finding useful patterns in a calendar is a different job from applying them. Burrow uses AI on request, then keeps everyday filtering in saved, editable rules."
date: "2026-10-14"
project: "burrow"
---

A calendar subscription often contains more than you want to see. A course calendar might mix lectures, labs, exams, and optional sessions in one feed. The titles contain clues, but turning those clues into a useful subscription takes work.

Burrow imports an existing iCalendar feed and lets you create filtered subscriptions from it. AI can help find the naming patterns. Saved rules determine which events match those patterns as the calendar changes.

The distinction matters. Discovering a useful way to organize a calendar involves interpretation. Applying an agreed set of rules should be repeatable and possible to inspect.

## Naming conventions are useful, but uneven

Imagine a feed with titles such as `Biology — Lecture 1`, `Biology — Lab 2`, and `Chemistry — Mandatory Lab`. You might want a subscription containing lectures and labs that are explicitly marked mandatory.

The source calendar may have no structured fields for those categories. The information lives in titles and descriptions, with conventions that differ between providers. Someone has to identify the patterns and express them as filters.

Burrow can ask AI to suggest categories, values, and matching rules from a sample of those texts. For this example, a useful suggestion might separate event type from requirement, with rules that look for words such as `Lecture`, `Lab`, and `Mandatory`.

That suggestion is an interpretation of the source's wording. A title without `Mandatory` does not establish that attendance is optional. A naming pattern can support a label without explaining everything about the event.

## Analysis starts with an explicit request

AI analysis runs when you choose **Suggest with AI**. Importing a calendar, opening its dashboard, refreshing its events, and downloading a filtered subscription do not call AI.

Manual rule editing is available without an AI request. You can define the categories and patterns yourself, or adjust the rules that analysis produced.

This separates a decision about sharing calendar text from the ordinary work of keeping a subscription current. A source can change many times without requiring another analysis.

## A sample is still calendar data

The analysis receives at most 60 title-and-description pairs, with a combined limit of 24,000 text characters. Sampling groups numbered title variants to make room for different naming patterns rather than filling the request with nearly identical sessions.

HTTP and HTTPS links and email addresses are redacted before sending. Source subscription URLs, event identifiers, locations, and subscription secrets are excluded from the fields sent to the model.

These restrictions reduce what leaves Burrow. They do not make the sample anonymous. A title or description can still contain a person's name, a private appointment, or other sensitive information. The interface explains that requesting analysis sends sampled text to OpenAI.

Event text is treated as untrusted data. The model has no tools or executable actions available; its job is to return a structured set of proposed rules.

## Suggestions become inspectable rules

Each rule selects a title, a description, or both, then applies one supported matching strategy:

- Contains a literal piece of text.
- Starts with a literal prefix.
- Equals a value, with normalization of whitespace and Unicode spelling.
- Matches a validated regular expression.

Rules can be edited, disabled, or removed. A result can therefore be traced back to a pattern in the saved configuration. With the same event text and rules, classification produces the same labels without asking a model again.

AI output must pass application validation before it can be used. Burrow checks category and value keys, size limits, supported strategies, and regular-expression compilation. Regex rules use RE2JS, with unsupported syntax and patterns that match empty input rejected.

Validation establishes that a suggestion fits the rule system. It does not establish that the suggested categories are useful or that every pattern reflects the calendar author's intent. A valid rule can still be too broad or miss an abbreviation.

The implementation separates these jobs in `lib/ai/calendar-taxonomy.ts`, `lib/calendar/rules.ts`, and `lib/calendar/classifier.ts`.

## Filtering has a defined meaning

Classification retains all matching labels. If an event matches both Lecture and Mandatory, both labels are available when building a subscription.

Selections within one category are alternatives. Selections across different categories must all be satisfied. For example:

```text
(Lab OR Lecture) AND Mandatory
```

This includes mandatory labs and lectures, while excluding optional labs and mandatory exams. Leaving a category unrestricted imposes no condition for it. Enabling a category with no selected values deliberately matches nothing.

Events matching no enabled rules are marked for review. Burrow does not invent a category to fill the gap. That review flag has a narrow meaning: it identifies zero-match events, not every event whose classification might need improvement.

## New events use the saved rules

When the source refreshes, Burrow reconciles the imported records and classifies new, changed, or restored events with the current rules. Refreshing does not ask AI to reinterpret the calendar.

Filtered feed requests read the saved events and classifications, then generate an iCalendar response. They make no AI requests and do not fetch the source calendar. A failed source refresh preserves the last successful snapshot so subscriptions can continue serving saved events.

This creates a predictable boundary, with a maintenance cost. If the source starts calling labs `Practical` instead of `Lab`, an existing rule may stop matching. You can edit the pattern or explicitly request another analysis. The system does not silently learn a new meaning during a refresh.

Recurring events introduce another boundary. Burrow filters a series using its master record and keeps its exceptions together, preserving reschedules and cancellations. It does not independently select individual occurrences of a recurring series.

## What the tests establish

Classifier and filter tests exercise literal matching, normalization, regular expressions, multiple labels, disabled rules, and the combination of subscription selections. AI tests use controlled responses to check sampling, redaction, validation, and failure handling.

Integration tests cover saved classifications, removal of stale labels, rule changes, and source synchronization. They check that failed refreshes preserve saved events and that updates retain event identity.

These tests establish behavior for defined inputs and mocked model responses. They do not measure how well a live model understands an unfamiliar calendar's naming conventions. That remains something to assess against the imported events and the proposed rules.

## The useful output is a rule you can understand

Burrow uses AI where finding a pattern can save effort. The lasting result is a set of editable rules that continues to work without a model in the filtering path.

Those rules make the limits visible too. They describe what the calendar's text matches, and they can be corrected when its conventions change.

The project is licensed under MIT. Its source repository will be linked here when the Daggmask GitHub organization is ready.
