# SauceDemo E2E Tests with Playwright

Automated end-to-end (E2E) tests for [SauceDemo](https://www.saucedemo.com/) using **Playwright**.  
Tests cover login, inventory, cart, checkout, menu navigation, and negative scenarios.

---

## Prerequisites

- Node.js >= 18.x  
- npm >= 8.x  
- Internet connection  

---

## Setup

1. Clone the repository or download ZIP:

```
git clone <your-repo-url>
cd <repo-folder>
```

2. Install dependencies:
```
npm install
```

3. Install Playwright browsers:
```
npx playwright install
```
---

## Running Tests

- Run all tests:
```
npx playwright test
```

- Run a specific test file:
```
npx playwright test e2e.spec.js
```

- Run in headed mode (with browser window):
```
npx playwright test --headed --project=chromium
```

- Generate HTML report:
```
npx playwright show-report
```
---

## Test Structure

- Login tests: valid and invalid logins for multiple users
- Full purchase flow: add products, checkout, verify order completion
- Menu navigation: reset app, logout, external links
- Negative tests: invalid login, missing checkout fields, broken or duplicate images
- All tests use test.step() for detailed reporting.

---

## Test Strategy

1. User Scenarios
- standard_user: happy path
- locked_out_user: login failure
- problem_user, visual_user, performance_glitch_user: asset issues, visual differences, performance testing

2. Assertions
- URL validation: expect(page).toHaveURL(...)
- Element visibility: expect(locator).toBeVisible()
- Cart count validation after each addition

3. Screenshots & Visual Validation
- Baseline screenshot for standard_user
- Visual comparison for visual_user

4. Negative Testing
- Invalid login credentials
- Missing checkout fields
- Broken or duplicate images

---

## Locator Strategy
- Prefer data-test attributes for stable selectors ([data-test="inventory-item-name"])
- Combine text and attributes for dynamic selection
- Avoid fragile selectors like nth-child or volatile class names

---

## Project Structure
```
/e2e
  └── e2e.spec.js        # Main test suite
/pages
  ├── login.page.js      # Login page object
  ├── inventory.page.js  # Inventory page object
  ├── product.page.js    # Product page object
  ├── cart.page.js       # Cart page object
  └── checkout.page.js   # Checkout page object
/test-results
```
