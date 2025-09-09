const { expect } = require('@playwright/test');
exports.ProductPage = class ProductPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.inventory_details_name');
    this.description = page.locator('.inventory_details_desc');
    this.addButton = page.getByRole('button', { name: /Add to cart/i });
    this.backButton = page.getByRole('button', { name: /Back to products/i });
    this.image = page.locator('.inventory_details_img_container img');
  }

  async expectOnProductPage(expectedName) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toHaveText(expectedName);
  }

  async addToCart() {
    await this.addButton.click();
  }

  async getImageSrc() {
    return await this.image.getAttribute('src');
  }
};
