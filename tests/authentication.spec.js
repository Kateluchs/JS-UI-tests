import { test, expect } from '@playwright/test';
import config from '.././framework/config/config';
import loginPage from '../framework/pages/login';
import navigation, { navigationElement } from '../framework/elements/header-nav';

test('1. Positive authentication', async ({ page }) => {
  await page.goto(config.url);
  
  await page.locator(loginPage.loginInput).click();
  await page.locator(loginPage.loginInput).fill(config.credentials.login);
  await page.locator(loginPage.passwordInput).fill(config.credentials.password);

  await expect(page).toHaveURL(`${config.url}/d/login`)

  await page.locator(loginPage.submitButton).click();

  await expect(page).toHaveURL(`${config.url}/d/`)
  
});

test('2. Negative authentication: invalid password', async ({ page }) => {
  await page.goto(config.url);
  
  await page.locator(loginPage.loginInput).click();
  await page.locator(loginPage.loginInput).fill(config.credentials.login);
  await page.locator(loginPage.passwordInput).fill('test');

  await expect(page).toHaveURL(`${config.url}/d/login`)

  await page.locator(loginPage.submitButton).click();

  await expect(page).toHaveURL(`${config.url}/d/login`)
  await expect(page.locator(loginPage.invalidDataMessage)).toHaveText(`Неправильные логин или пароль`)

});

test('3. Negative authentication: empty inputs', async ({ page }) => {
  await page.goto(config.url);

  await expect(page).toHaveURL(`${config.url}/d/login`)

  await page.locator(loginPage.submitButton).click();

  await expect(page).toHaveURL(`${config.url}/d/login`)
  await expect(page.locator(loginPage.invalidDataMessage)).toHaveText(`Доступ запрещён. Пожалуйста, авторизуйтесь.`)
  await expect(page.locator(loginPage.loginInputErrorMessage)).toHaveText(`Укажите корректный логин`)
  await expect(page.locator(loginPage.passwordInputErrorMessage)).toHaveText(`Вы не ввели пароль`)
  
});

test('4. Reset password button', async ({ page }) => {
  await page.goto(config.url);

  await expect(page).toHaveURL(`${config.url}/d/login`)

  await page.locator(loginPage.resetPassButton).click();
  const page1Promise = page.waitForEvent('popup');
  await page.locator(loginPage.resetPassLink).click();
  const page1 = await page1Promise;
  await expect(page1).toHaveURL(`https://kb.insentry.io/pages/viewpage.action?pageId=691024`)

});

test('6. Logout', async ({ page }) => {
  await page.goto(config.url);
  
  await page.locator(loginPage.loginInput).click();
  await page.locator(loginPage.loginInput).fill(config.credentials.login);
  await page.locator(loginPage.passwordInput).fill(config.credentials.password);

  await expect(page).toHaveURL(`${config.url}/d/login`)

  await page.locator(loginPage.submitButton).click();

  await expect(page).toHaveURL(`${config.url}/d/`)
  await expect(page.locator(navigationElement.header)).toBeVisible()

  await page.locator(navigationElement.logoutButton).click();

  await expect(page).toHaveURL(`${config.url}/d/login`)

  await page.goto(config.url);

  await expect(page).toHaveURL(`${config.url}/d/login`)
  await expect(page.locator(loginPage.invalidDataMessage)).toHaveText(`Доступ запрещён. Пожалуйста, авторизуйтесь.`)

});

