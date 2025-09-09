const { expect } = require('@playwright/test');
exports.InventoryPage = class InventoryPage {
  constructor(page) {
    this.page = page;

    //Container
    this.items = page.locator('[data-test="inventory-item"]');
    this.sortSelect = page.getByTestId('product_sort_container');
    this.cartBadge = page.locator('.shopping_cart_badge');

    //Menu
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.sideMenu = page.locator('.bm-menu');
  }

  async expectOnInventory() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }

  async getProductNames() {
    return await this.items.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getProductPrices() {
    return await this.items.locator('[data-test="inventory-item-price"]').allTextContents();
  }

  // Add a product to the cart by its name
  async addToCartByName(name) {
    // Find the product container by name
    const itemContainer = this.page.locator('[data-test="inventory-item-description"]', {
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: name })
    });

    // Find the button inside this container
    const button = itemContainer.locator('button', { hasText: 'Add to cart' });

    if (await button.count() === 0) {
      throw new Error(`Add to cart button not found for product: ${name}`);
    }

    await button.click();
  }

  async openProductByName(name) {
    await this.items
      .locator('[data-test="inventory-item-name"]', { hasText: name })
      .first()
      .click();
  }

  async sortBy(optionText) {
    await this.sortSelect.selectOption({ label: optionText });
    await this.page.waitForLoadState('networkidle');
  }

  async getCartCount() {
    return (await this.cartBadge.count()) ? await this.cartBadge.textContent() : '0';
  }

  async openMenu() {
    await this.menuButton.click();
    await expect(this.sideMenu).toBeVisible();
  }

  async clickMenuItem(logicalName) {
  const menuMap = {
    logout: 'logout-sidebar-link',
    reset: 'reset-sidebar-link',
    about: 'about-sidebar-link'
  };

  const testId = menuMap[logicalName];
  if (!testId) throw new Error(`No menu mapping for "${logicalName}"`);

  await this.page.locator(`[data-test="${testId}"]`).click();
}

};
