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

  // İlk ürün kartını bulana kadar kaydır let değişebilir, const değişmez
  let firstProductCard = page.locator('div[class*="productCardRoot"]').first(); //page.locator: sayfada elemnt arar, içindeki ifadeyi arar

  while (!(await firstProductCard.isVisible().catch(() => false))) { //ilk ürün kartı görünmüyorsa kaydırmaya devam et
    await page.mouse.wheel(0, 700); //700px aşağıya kaydır, yatay kaydırma
    await page.waitForTimeout(700); //700 milisaniye bekle
    firstProductCard = page.locator('div[class*="productCardRoot"]').first(); //kaydırdıktan sonra tekrar ilk ürün kartını bul
  }

  const productTitleLink = firstProductCard.locator('a[class*="titleText"]').first(); //ilk ürün kartının içindeki linkini bul
  const productPriceElement = firstProductCard.locator('text=/TL/').first(); //ilk ürün kartının içindeki fiyat elementini bul, fiyat genellikle TL içerir, 
  // bu yüzden text=/TL/ kullanılır
  const productPrice = await productPriceElement.innerText(); //ürün fiyatını al
  const productName = await productTitleLink.innerText(); //ürün adını al
  //Yukarıdakilerin hepsini sepette fiyatı karşılaştırmka için aldık


  await productTitleLink.scrollIntoViewIfNeeded(); //ürün başlığı görünene kadar kaydır
  await page.waitForTimeout(500); //yarım saniye bekle, scroll işlemi tamamlanana kadar
  await productTitleLink.click(); //ürün başlığına tıkla, ürün detay sayfasına git

  // Ürün detay sayfası
  await page.waitForLoadState('domcontentloaded'); //sayfanın içeriği yüklendiğinde devam et, bu sayede sonraki işlemler için gerekli elementler yüklenmiş olur
  await page.waitForTimeout(3000);

  // Sepete Ekle butonunu bulana kadar kaydır
  const addToCartButton = page.getByRole('button', { name: /Sepete ekle/i });

  while (!(await addToCartButton.isVisible().catch(() => false))) { //sepete ekle butonu görünmüyorsa kaydırmaya devam et
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(700);
  }

  await addToCartButton.click(); //sepete ekle butonuna tıkla
  await page.waitForTimeout(3000);

  // Sepete Git
  const goToCartButton = page.getByRole('button', { name: /Sepete git/i }); //sepete git butonunu bul

  if (await goToCartButton.isVisible({ timeout: 5000 })) { //sepete git butonu görünüyorsa tıkla, bazen sepete ekle butonuna tıkladıktan sonra 
  // sepete git butonu hemen görünmeyebilir, bu yüzden timeout ekledik
    await goToCartButton.click(); //sepete git butonuna tıkla
  }

  // Sepet sayfası
  await page.waitForLoadState('domcontentloaded'); //sepet sayfasının içeriği yüklendiğinde devam et
  await page.waitForTimeout(3000);

  // Sepette doğrulama
  const cartProductName = page.locator('div[class*="product_name"]').first(); //sepet sayfasında ürün adını içeren elementi bul
  const cartProductPrice = page.locator('text=/TL/').first(); //Tl içeren fiyat elementini bul

  await expect(cartProductName).toBeVisible(); //sepet sayfasında ürün adının görünür olduğunu doğrula
  await expect(cartProductPrice).toBeVisible(); //sepet sayfasında ürün fiyatının görünür olduğunu doğrula
  await expect(cartProductPrice).toContainText(productPrice); //sepet sayfasındaki ürün fiyatının, ürün detay sayfasında aldığımız fiyatla aynı olduğunu doğrula
  await expect(cartProductName).toContainText(productName); //sepet sayfasındaki ürün adının, ürün detay sayfasında aldığımız ürün adıyla aynı olduğunu doğrula
  await expect(cartProductPrice).toContainText('TL'); //sepet sayfasındaki ürün fiyatının TL içerdiğini doğrula, çünkü fiyat genellikle TL ile biter
});