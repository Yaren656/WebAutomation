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

  // İlk görünen ürün başlık linkini bul
  const productTitleLink = page.locator('a[class*="titleText"]').first();

  await productTitleLink.scrollIntoViewIfNeeded();
  await expect(productTitleLink).toBeVisible();

  // Ürün kartını link üzerinden bul
  const firstProductCard = productTitleLink.locator(
    'xpath=ancestor::div[contains(@class,"productCardRoot")]'
  );

  // Ana sayfadaki ürün bilgileri
  const productPriceElement = firstProductCard.locator('div[class*="price"]').last();

  const productName = await productTitleLink.innerText();
  const productPrice = await productPriceElement.innerText();

  // Ürün detayına git
  await page.waitForTimeout(500);
  await productTitleLink.click();

  // Ürün detay sayfası
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Sepete ekle butonunu bul
  const addToCartButton = page.getByRole('button', { name: /Sepete ekle/i });

  await addToCartButton.scrollIntoViewIfNeeded();
  await expect(addToCartButton).toBeVisible({ timeout: 10000 });

  // Sepete ekle
  await addToCartButton.click();
  await page.waitForTimeout(3000);

  // Sepete git
  const goToCartButton = page.getByRole('button', { name: /Sepete git/i });

  await expect(goToCartButton).toBeVisible({ timeout: 10000 });
  await goToCartButton.click();

  // Sepet sayfası
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Sepette ürün doğrulama
  const cartProductName = page.locator('div[class*="product_name"]').first();
  const cartProductPrice = page.locator('div[class*="price"]').first();

  await expect(cartProductName).toBeVisible({ timeout: 10000 });
  await expect(cartProductPrice).toBeVisible({ timeout: 10000 });

  // Ürün adı ve fiyat doğrulama
  await expect(cartProductName).toContainText(productName);
  await expect(cartProductPrice).toContainText('TL');
});