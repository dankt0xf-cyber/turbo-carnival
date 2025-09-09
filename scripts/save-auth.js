const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(process.env.TEST_BASE_URL || 'https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/.*inventory.html/);
  await context.storageState({ path: 'auth/storageState.json' });
  await browser.close();
  console.log('Saved storageState to auth/storageState.json');
})();
