---
name: playwright-test-flow
description: Use when planning, adding, or changing Playwright tests and the user should approve test locations and scenarios before implementation.
---

# Playwright Test Flow

1. Inspect existing specs, fixtures, helpers, page objects, selectors, and application behavior. Identify relevant coverage and setup preconditions. Do not edit files yet.

2. Propose the best test location and explain any meaningful tradeoffs. Ask the user to approve the location before discussing scenarios.

3. After location approval, propose focused scenarios with their initial state, actions, and expected results. Ask for separate scenario approval.

4. After both approvals, implement only the approved coverage. Follow repository conventions, centralize reusable locators, prefer stable selectors, and keep tests independent.

5. If a test fails, verify the action, fixture state, and locator before changing expectations. Fix missing product behavior rather than weakening a valid regression test.

6. Run the narrowest relevant Playwright tests, then required formatting, linting, type, and diff checks. Report what passed and anything that could not run.

Keep location and scenario approval as distinct checkpoints unless the user explicitly asks to combine them. Obtain approval again if the plan materially changes.
