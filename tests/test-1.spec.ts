import { test, expect } from '@playwright/test';

test('hepsiburada product selection and checkout navigation', async ({ page }) => {
  test.setTimeout(60000);

  // Ana sayfa
  await page.goto('https://www.hepsiburada.com/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Çerez popup varsa kabul et
  const acceptButton = page.getByText('Kabul Et', { exact: true });

  try {
    if (await acceptButton.isVisible({ timeout: 3000 })) {
      await acceptButton.click();
      await page.waitForTimeout(1000);
    }
  } catch {}

  // İlk gerçek ürün linkini bul
  const productTitleLink = page.locator('a[href*="/p/"]').first();

  // Önce görünür olmasını bekle
  await expect(productTitleLink).toBeVisible({ timeout: 15000 });

  // Sonra görünür alana getir
  await productTitleLink.scrollIntoViewIfNeeded();

  // Ürün kartını parent üzerinden bul
  const firstProductCard = productTitleLink.locator(
    'xpath=ancestor::div[contains(@class,"productCardRoot")]'
  );

  // Ürün adı ve fiyat
  const productPriceElement = firstProductCard.locator('div[class*="price"]').last();

  const productName = (await productTitleLink.innerText()).trim();
  const productPrice = (await productPriceElement.innerText()).trim();

  // Ürün detayına git
  await page.waitForTimeout(500);
  await productTitleLink.click();

  // Ürün detay sayfası
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Sepete Ekle
  const addToCartButton = page.getByRole('button', { name: /Sepete ekle/i });

  await expect(addToCartButton).toBeVisible({ timeout: 15000 });
  await addToCartButton.scrollIntoViewIfNeeded();

  await addToCartButton.click();
  await page.waitForTimeout(3000);

  // Sepete Git
  const goToCartButton = page.getByRole('button', { name: /Sepete git/i });

  await expect(goToCartButton).toBeVisible({ timeout: 15000 });
  await goToCartButton.click();

  // Sepet sayfasına geçiş
  await page.waitForURL(/sepetim|checkout/, { timeout: 15000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Sepette ürün adı ve fiyat
  const cartProductName = page.locator('a[href*="/p/"]').first();
  const cartProductPrice = page.locator('text=/TL/').first();

  // Doğrulamalar
  await expect(cartProductName).toBeVisible({ timeout: 15000 });
  await expect(cartProductPrice).toBeVisible({ timeout: 15000 });

  await expect(cartProductName).toContainText(productName);
  await expect(cartProductPrice).toContainText('TL');
});