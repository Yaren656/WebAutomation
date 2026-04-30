import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: any) {
    super(page);
  }

  async verifyProductInCart() { // Sepette ürünün göründüğünü doğrula
    await expect(this.page).toHaveURL(/sepetim|checkout/); // URL'nin sepet veya ödeme sayfası olduğunu doğrula
    const cartHeading = this.page.getByRole('heading', { name: /sepete?|sepetim/i }).first(); // Sepet başlığını bul
    await expect(cartHeading).toBeVisible({ timeout: 15000 }); // Sepet başlığının görünür olduğunu doğrula

    const cartProductName = this.page.locator('div[class*="product_name"] a, div[class*="product_name"] a').first(); // Sepetteki ürün adını bul
    await expect(cartProductName).toBeVisible({ timeout: 15000 }); // Sepetteki ürün adının görünür olduğunu doğrula

    const cartProductPrice = this.page.locator('text=/TL/').first(); // Sepetteki ürün fiyatını bul (TL içeren herhangi bir metin)
    await expect(cartProductPrice).toBeVisible({ timeout: 15000 }); // Sepetteki ürün fiyatının görünür olduğunu doğrula
  }
}
