import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.use({ headless: false, launchOptions: { slowMo: 150 } });

test('hepsiburada product image click and add to cart', async ({ page }) => {
  test.setTimeout(120000);

  const homePage = new HomePage(page);
  await homePage.navigateToHome();

  const productPage = await homePage.openFirstProductInNewTab();
  const detailPage = new ProductPage(productPage);

  await detailPage.addToCart();
  await detailPage.goToCart();

  const cartPage = new CartPage(productPage);
  await cartPage.verifyProductInCart();

  await productPage.waitForTimeout(5000);
});
