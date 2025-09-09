const { expect } = require('@playwright/test');
exports.CartPage = class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="cart_item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async expectOnCart() {
    await expect(this.page).toHaveURL(/.*cart.html/);
  }

  /*async getCartItemNames() {
    
  }*/

  /*async removeItemByName(name) {

  }*/

  async proceedToCheckout() {
    await this.checkoutButton.click();
    
  }

  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async getErrorText() {
    return await this.errorMessage.textContent();
  }
};
