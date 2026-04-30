//her yerde lazım olabilecek araç kutusu
import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async acceptCookies() {
    const acceptButton = this.page.getByText('Kabul Et', { exact: true });
    try {
      if (await acceptButton.isVisible({ timeout: 5000 })) {
        await acceptButton.click();
        await this.page.waitForTimeout(1000);
      }
    } catch {
      // Çerez popup yoksa devam et
    }
  }

  async scrollDown() { // Sayfayı yarım ekran kaydır
    await this.page.evaluate(() => window.scrollBy(0, window.innerHeight / 2));
    await this.page.waitForTimeout(1000);
  }
}
