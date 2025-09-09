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

```bash
git clone <your-repo-url>
cd <repo-folder>

2. Install dependencies:
```bash
npm install


3. Install Playwright browsers:
```bash
npx playwright install

---

## Running Tests

i. Run all tests:

npx playwright test


ii. Run a specific test file:

npx playwright test e2e.spec.js


iii. Run in headed mode (with browser window):

npx playwright test --headed


iv. Generate HTML report:

npx playwright show-report


