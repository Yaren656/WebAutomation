import { test, expect } from '@playwright/test';

test('hepsiburada product selection and checkout navigation', async ({ page }) => {
  test.setTimeout(90000);

  // Ana sayfa
  await page.goto('https://www.hepsiburada.com/');
  await page.waitForTimeout(3000);

  // Çerez popup varsa kabul et
  const acceptButton = page.getByText('Kabul Et', { exact: true });

  try {
    if (await acceptButton.isVisible({ timeout: 5000 })) {
      await acceptButton.click();
      await page.waitForTimeout(1500);
    }
  } catch {}

  // İlk ürün kartını bul
  let firstProductCard = page.locator('div[class*="productCardRoot"]').first();

  // Lazy load için ürün görünene kadar sayfa sonuna doğru kaydır
  while (!(await firstProductCard.isVisible().catch(() => false))) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    // Yeni içerik yüklenmesi için bekle
    await page.waitForTimeout(2000);

    // Locator yeniden kontrol
    firstProductCard = page.locator('div[class*="productCardRoot"]').first();
  }

  // İlk ürün kartı görünür olduğunda içine git
  await firstProductCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // İlk ürün kartındaki başlık linki
  const productTitleLink = firstProductCard.locator('a[class*="titleText"]').first();

  // Bilgileri al
  const productName = await productTitleLink.innerText(); 

  // Ürüne tıkla
  await productTitleLink.click();

  // Ürün detay sayfası
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Sepete Ekle butonu
  const addToCartButton = page.getByRole('button', { name: /Sepete ekle/i });

  // Buton görünene kadar lazy load scroll
  while (!(await addToCartButton.isVisible().catch(() => false))) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    await page.waitForTimeout(1500);
  }

  // Sepete ekle
  await addToCartButton.click();
  await page.waitForTimeout(3000);

  // Sepete Git
  const goToCartButton = page.getByRole('button', { name: /Sepete git/i });

  await expect(goToCartButton).toBeVisible({ timeout: 15000 });
  await goToCartButton.click();

  // Sepet sayfası
  await page.waitForURL(/sepetim|checkout/, { timeout: 15000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Sepet ürün bilgileri
  const cartProductName = page.locator('div[class*="product_name"] a').first();
  const cartProductPrice = page.locator('text=/TL/').first();

  // Kontroller
  await expect(cartProductName).toBeVisible({ timeout: 15000 });
  await expect(cartProductPrice).toBeVisible();

  await expect(cartProductName).toContainText(productName);
  await expect(cartProductPrice).toContainText('TL');
});