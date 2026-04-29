import { test, expect } from '@playwright/test';

test('hepsiburada product selection and checkout navigation', async ({ page }) => {
  await page.goto('https://www.hepsiburada.com/');
  await page.waitForTimeout(3000);

  // Kabul Et varsa tıkla
  const acceptButton = page.getByText('Kabul Et', { exact: true });
  try {
    if (await acceptButton.isVisible({ timeout: 3000 })) {
      await acceptButton.click();
      await page.waitForTimeout(1000);
    }
  } catch {}

  // İlk ürün kartını bulana kadar kaydır
  let firstProductCard = page.locator('div[class*="productCardRoot"]').first();

  while (!(await firstProductCard.isVisible().catch(() => false))) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(700);
    firstProductCard = page.locator('div[class*="productCardRoot"]').first();
  }

  // Ana sayfadaki ürün bilgileri
  const productTitleLink = firstProductCard.locator('a[class*="titleText"]').first();
  const productPriceElement = firstProductCard.locator('div[class*="price"]').last();

  const productName = await productTitleLink.innerText();
  const productPrice = await productPriceElement.innerText();

  // Ürün detayına git
  await productTitleLink.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await productTitleLink.click();

  // Ürün detay sayfası
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Sepete ekle butonunu bulana kadar kaydır
  const addToCartButton = page.getByRole('button', { name: /Sepete ekle/i });

  while (!(await addToCartButton.isVisible().catch(() => false))) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(700);
  }

  // Sepete ekle
  await addToCartButton.click();
  await page.waitForTimeout(3000);

  // Sepete git popup butonu
  const goToCartButton = page.getByRole('button', { name: /Sepete git/i });

  await expect(goToCartButton).toBeVisible({ timeout: 10000 });
  await goToCartButton.click();

  // Sepet sayfası
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Sepette ürün adı ve fiyat
  const cartProductName = page.locator('div[class*="product_name"]').first();
  const cartProductPrice = page.locator('div[class*="price"]').first();

  // Doğrulamalar
  await expect(cartProductName).toBeVisible();
  await expect(cartProductPrice).toBeVisible();

  await expect(cartProductName).toContainText(productName);
  await expect(cartProductPrice).toContainText('TL');
});