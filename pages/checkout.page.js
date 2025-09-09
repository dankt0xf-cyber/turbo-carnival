const { expect } = require('@playwright/test');
exports.CheckoutPage = class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.finishBtn = page.locator('[data-test="finish"]');
    this.completeText = page.getByText('THANK YOU FOR YOUR ORDER');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillUserInfo(first = 'John', last = 'Doe', zip = '12345') {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
  }

  async continue() {
    await this.continueBtn.click();
  }

  async finish() {
    await this.finishBtn.click();
  }

  async expectOrderComplete() {
    await expect(this.completeText).toBeVisible();
  }

  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async getErrorText() {
    return await this.errorMessage.textContent();
  }
};
