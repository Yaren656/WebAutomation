import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async addToCart() {
  const addToCartButton = this.page.getByRole('button', { name: /Sepete ekle/i });

  await addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
  await addToCartButton.scrollIntoViewIfNeeded(); // Buton görünene kadar kaydır
  await this.page.waitForTimeout(1000);
  const currentUrl = this.page.url(); // Mevcut URL'yi kaydet
  await addToCartButton.click();
  await this.page.waitForTimeout(4000);
  if (this.page.url() !== currentUrl) {
    throw new Error('Sepete ekle sonrası sayfa yenilendi veya yönlendirildi.');
  }
}

  async goToCart() {
    const goToCartButton = this.page.getByRole('button', { name: /Sepete git/i }).first();
    await goToCartButton.waitFor({ state: 'visible', timeout: 15000 });
    await goToCartButton.scrollIntoViewIfNeeded(); // Buton görünene kadar kaydır
    await goToCartButton.click({ force: true }); // Zorla tıklama, bazen butonun üstünde başka bir element olabilir
    await this.page.waitForURL(/sepetim|checkout/, { timeout: 15000 });
  }
}
