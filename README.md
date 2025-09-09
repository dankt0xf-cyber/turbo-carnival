Sure! Here's a clean, easy-to-copy Markdown README.md for your Playwright SauceDemo tests:

# SauceDemo E2E Tests with Playwright

This repository contains end-to-end (E2E) automated tests for [SauceDemo](https://www.saucedemo.com/) using **Playwright**.  
The tests cover login, inventory, cart, checkout, menu navigation, and negative scenarios.

---

## Prerequisites

- Node.js >= 18.x  
- npm >= 8.x  
- Internet connection  

---

## Setup

1. Clone the repo or download as ZIP:

```bash
git clone <your-repo-url>
cd <repo-folder>


Install dependencies:

npm install


Install Playwright browsers:

npx playwright install

Running Tests

Run all tests:

npx playwright test


Run a specific file:

npx playwright test e2e.spec.js


Run in headed mode:

npx playwright test --headed


Generate HTML report:

npx playwright show-report

Test Structure

Login tests: valid and invalid logins for multiple users

Full purchase flow: add products, checkout, verify order

Menu navigation: reset app, logout, external links

Negative tests: invalid login, missing checkout fields, broken images

All tests use test.step() for clear reporting.

Test Strategy

User scenarios

standard_user: happy path

locked_out_user: login failure

problem_user / visual_user / performance_glitch_user: detect bugs, visual diffs, slow loading

Assertions

URL checks: expect(page).toHaveURL(...)

Element visibility: expect(locator).toBeVisible()

Cart count validation

Screenshots & Visual Comparison

Baseline screenshot for standard_user

Compare visual_user screenshot against baseline

Negative Testing

Invalid credentials

Missing fields in checkout

Broken or duplicate images

Locator Strategy

Prefer data-test attributes for stable selectors

Combine text and attributes for dynamic selection

Avoid fragile selectors like nth-child or changing classes

Project Structure
/e2e
  └── e2e.spec.js         # Main tests
/pages
  ├── login.page.js       # Login page
  ├── inventory.page.js   # Inventory page
  ├── product.page.js     # Product page
  ├── cart.page.js        # Cart page
  └── checkout.page.js    # Checkout page
/test-results
  └── *.png               # Screenshots
package.json
README.md

