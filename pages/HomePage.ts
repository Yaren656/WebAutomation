//ana sayfa ile ilgili işlemler burada yapılır
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToHome() {
    await this.page.goto('https://www.hepsiburada.com/');
    await this.page.waitForTimeout(3000);
    await this.acceptCookies();
  }

  async openFirstProductInNewTab() { // İlk ürünün linkini yeni sekmede aç
    const firstProductCard = this.page.locator(
      'div[class*="productCard-module_productCardRoot"]'
    ).first(); 

    while (!(await firstProductCard.isVisible().catch(() => false))) { // Ürün kartı görünene kadar kaydır
    await this.scrollDown();
    await this.page.waitForTimeout(1500);
    }

    await firstProductCard.scrollIntoViewIfNeeded(); 
    await this.page.waitForTimeout(1500);
    await firstProductCard.waitFor({ state: 'visible', timeout: 10000 });

    const productLink = firstProductCard.locator('a[class*="titleText"], a:has(img)').first(); // Ürün kartındaki linki bul
    const href = await productLink.getAttribute('href');
    if (!href) {
      throw new Error();
    }

    const newPagePromise = this.page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null);
    await productLink.click();

    const newPage = await newPagePromise;
    if (!newPage) {
    throw new Error('Yeni sekme açılamadı.');
    }
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}
