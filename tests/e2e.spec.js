const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { InventoryPage } = require('../pages/inventory.page');
const { ProductPage } = require('../pages/product.page');
const { CartPage } = require('../pages/cart.page');
const { CheckoutPage } = require('../pages/checkout.page');

const users = [
    { username: 'standard_user', valid: true, note: 'happy path' },
    { username: 'locked_out_user', valid: false, note: 'locked account' },
    { username: 'problem_user', valid: true, note: 'asset issues(Task6c)' },
    { username: 'performance_glitch_user', valid: true, note: 'slow load' },
    { username: 'error_user', valid: true, note: 'server errors on assets' },
    { username: 'visual_user', valid: true, note: 'visual diffs (Task 6c,7)' }
];
/*test.use({
  storageState: 'auth/storageState.json', // reuse saved login
});*/


test.describe('SauceDemo - E2E', () => {
    for (const u of users) {
        test.describe(`${u.username}`, () => {
            test(`${u.valid ? 'should login successfully (Task 1)' : 'should show login error'} - ${u.note}`, async ({ page }, testInfo) => {
                const login = new LoginPage(page);
                await test.step('Go to login page', async () => { await login.goto(); });

                await test.step('Attempt login', async () => {
                    await login.login(u.username, 'secret_sauce');
                });

                // Take screenshot as buffer
                const screenshot = await page.screenshot({ fullPage: true });
                // Save baseline to file (for later compare)
                const fs = require('fs');


                if (u.valid) {
                    await test.step('Assert redirect to inventory', async () => {
                        await expect(page).toHaveURL(/.*inventory.html/);
                    });


                    if (u.username === 'standard_user') {

                        fs.writeFileSync('test-results/standard_user.png', screenshot);

                        // Attach to report
                        await testInfo.attach('Standard User Screenshot', {
                            body: screenshot,
                            contentType: 'image/png',
                        });
                    }

                    // Additional checks for visual user
                    if (u.username === 'visual_user') {

                        const baseline = fs.readFileSync('test-results/standard_user.png');

                        // Compare against baseline
                        expect(screenshot.equals(baseline)).toBeFalsy();

                        // Attach current screenshot
                        await testInfo.attach('Visual User Screenshot', {
                            body: screenshot,
                            contentType: 'image/png',
                        });
                    }


                    // Additional checks for problem_user
                    if (u.username === 'problem_user') {
                        await test.step('Catch bug: broken or duplicate images', async () => {
                            const imgs = await page.locator('.inventory_item_img img').all();
                            const srcs = [];

                            for (const img of imgs) {
                                const src = await img.getAttribute('src');

                                if (!src) {
                                    await testInfo.attach('broken-image-src', {
                                        body: `Missing src on image element`
                                    });
                                } else {
                                    srcs.push(src);
                                }
                            }

                            // Check for duplicates
                            const unique = new Set(srcs);
                            if (unique.size !== srcs.length) {
                                // Attach text message
                                await testInfo.attach('duplicate-images-info', {
                                    body: `Some products share the same image: ${srcs.join(', ')}`
                                });

                                // Attach screenshot to report
                                await testInfo.attach('duplicate-images-screenshot', {
                                    body: screenshot,
                                    contentType: 'image/png'
                                });
                            }

                        });
                    }


                    /*
                    
                              /* if (u.username === 'performance_glitch_user') {
                                await test.step('Measure page load', async () => {
                                  const perf = await page.evaluate(() => JSON.stringify(window.performance.timing));
                                  testInfo.attach('performance-timing', { body: perf });
                                });
                              }*/

                } else {
                    await test.step('Catch bug: Error during login', async () => {
                        await login.expectErrorVisible();
                        // Attach screenshot to report
                        await testInfo.attach('error-during-login-screenshot', {
                            body: screenshot,
                            contentType: 'image/png'
                        });
                    });
                }
            });
        });
    }


    test('Full purchase flow (standard_user) - Task 2,3,4', async ({ page }) => {
        const login = new LoginPage(page);
        const inventory = new InventoryPage(page);
        const product = new ProductPage(page);
        const cart = new CartPage(page);
        const checkout = new CheckoutPage(page);

        await test.step('Login as standard_user', async () => {
            await login.goto();
            await login.login('standard_user', 'secret_sauce');
            await expect(page).toHaveURL(/.*inventory.html/);
        });

        await test.step('Assert inventory items (Task 2a)', async () => {
            await inventory.expectOnInventory();
            const names = await inventory.getProductNames();
            expect(names.length).toBeGreaterThan(0);
        });

        await test.step('Navigate to a product (Task 2d)', async () => {
            const productName = 'Sauce Labs Fleece Jacket';
            await page.locator('[data-test="inventory-item-name"]', { hasText: productName }).click();
            await product.expectOnProductPage(productName);
            await page.click('[data-test="back-to-products"]');
        });

        await test.step('Add to cart (Task 3a,b) & Open cart (Task 3c)', async () => {
            const addedProducts = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

            // Add products one by one
            for (const product of addedProducts) {
                await test.step(`Add product: ${product}`, async () => {
                    await inventory.addToCartByName(product);

                    // Verify cart badge incrementally after each add
                    const cartCount = await inventory.getCartCount();
                    expect(Number(cartCount)).toBeGreaterThan(0);
                });
            }

            // Ensure cart badge matches expected count
            const finalCartCount = await inventory.getCartCount();
            expect(Number(finalCartCount)).toBe(addedProducts.length);

            // Navigate to Cart
            await page.locator('[data-test="shopping-cart-link"]').click();
            await cart.expectOnCart();

        });

        await test.step('Proceed to checkout and complete (Task 4)', async () => {
            await cart.proceedToCheckout();
            await checkout.fillUserInfo('John', 'Doe', '12345');
            await checkout.continue();
            await checkout.finish();
            await checkout.expectOrderComplete();
        });
    });


    test('Navigate menu tests (Task 5a,b)', async ({ page }) => {
        const login = new LoginPage(page);
        const inventory = new InventoryPage(page);

        await login.goto();
        await login.login('standard_user', 'secret_sauce');
        await inventory.expectOnInventory();

        await test.step('Reset App State (Task 5a)', async () => {
            await inventory.openMenu();
            await inventory.clickMenuItem('reset');
            const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
            await expect(cartBadge).toBeHidden();

        });

        await test.step('Logout and Return to Login Page (Task 5b)', async () => {
            await inventory.clickMenuItem('logout');
            await expect(page).toHaveURL(/.*saucedemo.com\/?/);
        });
    });

    test('Navigate menu tests - to external link(Task 5a)', async ({ page }) => {
        const login = new LoginPage(page);
        const inventory = new InventoryPage(page);

        await login.goto();
        await login.login('standard_user', 'secret_sauce');
        await inventory.expectOnInventory();

        await test.step('Navigate About (Task 5a)', async () => {
            await inventory.openMenu();
            await inventory.clickMenuItem('about');
            await expect(page).not.toHaveURL(/.*saucedemo.com\/?/);

        });
    });

    test('Negative tests - invalid login (Task 6)', async ({ page }) => {
        const login = new LoginPage(page);
        const cart = new CartPage(page);
        const checkout = new CheckoutPage(page);

        // Invalid login
        await test.step('Invalid login (Task 6a)', async () => {
            await login.goto();
            await login.login('bad_user', 'wrong_pass');
            await login.expectErrorVisible();
        });

        // Missing fields
        await test.step('Missing fields (Task 6b)', async () => {
            await login.goto();
            await login.login('standard_user', 'secret_sauce');

            await page.locator('[data-test="shopping-cart-link"]').click();// click cart icon (empty)
            await cart.proceedToCheckout(); //click checkout
            await checkout.continue(); //click continue without fill in
            await checkout.expectErrorVisible(); //expect error message

        });



    });

});
