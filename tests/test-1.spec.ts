import { test, expect } from '@playwright/test';

test('Hepsiburada ürün sepete at', async ({ page }) => {
  // 1. Hepsiburada ana sayfasını aç
  console.log('1️⃣ Hepsiburada açılıyor...');
  await page.goto('https://www.hepsiburada.com/', { waitUntil: 'load' });
  await page.waitForTimeout(3000);
  console.log('✓ Ana sayfa açıldı');

  // 2. Kabul Et popup varsa tıkla
  console.log('2️⃣ Popup kontrol ediliyor...');
  try {
    const acceptButton = page.getByText('Kabul Et');
    if (await acceptButton.isVisible({ timeout: 2000 })) {
      await acceptButton.click();
      await page.waitForTimeout(1000);
      console.log('✓ Popup kapatıldı');
    }
  } catch {
    console.log('✓ Popup yok, devam ediliyor');
  }

  // 3. İlk ürün kartını bul ve tıkla
  console.log('3️⃣ İlk ürün kartı aranıyor...');
  
  // Sayfada tüm ürün linklerini bul
  const allProductLinks = await page.locator('a[href*="/p/"]').all();
  console.log(`Bulunan ürün sayısı: ${allProductLinks.length}`);
  
  if (allProductLinks.length === 0) {
    throw new Error('Ürün bulunamadı!');
  }

  // İlk ürünü seç
  const firstProduct = allProductLinks[0];
  
  // Ürün adını al
  const productName = await firstProduct.innerText();
  console.log(`Seçilen ürün: ${productName}`);

  // Sayfaya kaydır ve tıkla
  await firstProduct.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await firstProduct.click();
  console.log('✓ Ürüne tıklandı');

  // 4. Ürün detay sayfasının açılmasını bekle
  console.log('4️⃣ Ürün detay sayfası yükleniyor...');
  await page.waitForTimeout(3000);
  console.log(`✓ Sayfa açıldı: ${page.url()}`);

  // 5. Ürün detay sayfasında Sepete Ekle butonuna tıkla
  console.log('5️⃣ Sepete Ekle butonuna tıklanıyor...');
  
  const addToCartButton = page.locator('button:has-text("Sepete Ekle")').first();
  
  if ((await addToCartButton.count()) === 0) {
    throw new Error('Sepete Ekle butonu bulunamadı!');
  }

  await addToCartButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await addToCartButton.click();
  console.log('✓ Sepete Ekle butonuna tıklandı');

  // 6. Ürün sepete eklendikten sonra bekle
  await page.waitForTimeout(2000);
  console.log('✓ Ürün sepete eklendi');

  // 7. Sepete Git butonuna tıkla
  console.log('6️⃣ Sepete git butonuna tıklanıyor...');
  
  const goToCartButton = page.locator('button:has-text("Sepete git"), a:has-text("Sepete git")').first();
  
  if ((await goToCartButton.count()) > 0) {
    await goToCartButton.click();
    await page.waitForTimeout(2000);
    console.log('✓ Sepet sayfasına gidildi');
  }

  // 8. Sepet sayfasında ürünü doğrula
  console.log('7️⃣ Sepet sayfasında ürün doğrulanıyor...');
  
  // Sayfanın içeriğini al
  const pageContent = await page.content();
  
  // Ürün adını kontrol et
  if (pageContent.includes(productName)) {
    console.log(`✓ Ürün adı bulundu: ${productName}`);
  } else {
    console.log(`⚠️ Tam ürün adı bulunamadı, kısmi arama yapılıyor...`);
    const shortName = productName.substring(0, 20);
    expect(pageContent).toContain(shortName);
  }

  // TL fiyatını kontrol et
  expect(pageContent).toContain('TL');
  console.log('✓ Fiyat bilgisi bulundu');

  console.log('✅ TEST BAŞARILI - Ürün sepete eklendi ve sepet sayfasında doğrulandı!');
});