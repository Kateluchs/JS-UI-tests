import { test, expect, firefox, webkit } from '@playwright/test';
import config from '.././framework/config/config';
import { LoginPage } from '../framework/pages/login.page';
import { ViewPage } from '../framework/pages/view.page';
import { NavigationElement } from '../framework/elements/header-nav.element';



test.describe('First authentication', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto()
  });

  test('Redirect to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(config.baseUrl);
    await expect(page).toHaveURL(loginPage.url)
    await expect(loginPage.loginInput).toHaveValue('Admin')
  });

  test('Login incorrect input messages', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginInput.fill('')
    await loginPage.submitButton.click()
    await expect(loginPage.adminLoginInputErrorMessage).toHaveText('Пожалуйста, заполните это поле')

  });

  test('New password incorrect input messages', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const content = [
      {
        input: '',
        message: 'Пожалуйста, заполните это поле'
      },
      {
        input: 'Qwqrt',
        message: 'Не менее 6 символов'
      },
      {
        input: 'Qwqrty',
        message: 'Пароль должен содержать цифру, заглавную и строчную букву'
      },
      {
        input: 'qwqrty5',
        message: 'Пароль должен содержать цифру, заглавную и строчную букву'
      }
    ]

    for (const item of content) {
      await loginPage.newPasswordInput.fill(item.input)
      await loginPage.submitButton.click()
      await expect(loginPage.newPasswordErrorMessage).toHaveText(item.message)
    }

  });

  test('Confirm password incorrect input messages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inputContent = ['', 'Qwqrt'];
    const messageContent = ['Пожалуйста, заполните это поле', 'Пароли не совпадают'];

    for (const input of inputContent) {
      await loginPage.confirmPasswordInput.fill(input)
      await loginPage.submitButton.click()
      await expect(loginPage.confirmPasswordErrorMessage).toHaveText(messageContent[inputContent.indexOf(input)])
    }

  });

  test('Show and hide password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.newPasswordInput.fill('Achfnk0')
    await loginPage.confirmPasswordInput.fill('Achfnk0')

    await expect(loginPage.newPasswordInput).toHaveAttribute('type', 'password')
    await expect(loginPage.confirmPasswordInput).toHaveAttribute('type', 'password')

    await loginPage.newPasswordEyeButton.click()

    await expect(loginPage.newPasswordInput).toHaveAttribute('type', 'text')
    await expect(loginPage.confirmPasswordInput).toHaveAttribute('type', 'text')

    await loginPage.confirmPasswordEyeButton.click()

    await expect(loginPage.newPasswordInput).toHaveAttribute('type', 'password')
    await expect(loginPage.confirmPasswordInput).toHaveAttribute('type', 'password')

    await loginPage.confirmPasswordEyeButton.click()

    await expect(loginPage.newPasswordInput).toHaveAttribute('type', 'text')
    await expect(loginPage.confirmPasswordInput).toHaveAttribute('type', 'text')

    await loginPage.newPasswordEyeButton.click()

    await expect(loginPage.newPasswordInput).toHaveAttribute('type', 'password')
    await expect(loginPage.confirmPasswordInput).toHaveAttribute('type', 'password')

  });

  test('Correct inputs and first login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginInput.fill(config.credentials.loginName)
    await loginPage.newPasswordInput.fill(config.credentials.password)
    await loginPage.confirmPasswordInput.fill(config.credentials.password)
    await loginPage.loginInput.click()
    await expect(loginPage.newPasswordErrorMessage).not.toBeVisible()
    await expect(loginPage.confirmPasswordErrorMessage).not.toBeVisible()
    await loginPage.toggle.click()
    await loginPage.submitButton.click()
    await expect(page).toHaveURL(`${config.baseUrl}/d/admin`)


  });

});

test.describe('Authentication', () => {

  test.skip('Other browser message (Firefox)', async () => {
    
    const browser = await webkit.launch();
    const context = await browser.newContext();

    const page = await context.newPage();
    await page.goto(config.baseUrl);
    await expect(page.locator('div[class*=NotSupportBrowser_message]')).toBeVisible()

    await context.close();

  });

  test('Positive authentication', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const viewPage = new ViewPage(page);

    await page.goto(config.baseUrl);

    await expect(page).toHaveURL(loginPage.url)

    await loginPage.login()

    await expect(page).toHaveURL(viewPage.url)

  });

  test('Negative authentication: invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(config.credentials.login, 'test')

    await expect(page).toHaveURL(loginPage.url)
    await expect(loginPage.invalidDataMessage).toHaveText(`Неправильные логин или пароль`)

  });

  test('Negative authentication: empty inputs', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('', '')

    await expect(page).toHaveURL(loginPage.url)
    await expect(loginPage.loginInputErrorMessage).toHaveText(`Пожалуйста, заполните это поле`)
    await expect(loginPage.passwordInputErrorMessage).toHaveText(`Пожалуйста, заполните это поле`)

  });

  test('Show and hide password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto()
    await loginPage.passwordInput.fill('Achfnk0')

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')

    await loginPage.eyeButton.click()

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text')

    await loginPage.eyeButton.click()

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')

  });

  test('Reset password button', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.resetPassButton.click();

    const page1Promise = page.waitForEvent('popup');
    await loginPage.resetPassLink.click();
    const page1 = await page1Promise;

    await expect(page1).toHaveURL(`https://doc.insentry.io/ru/`)

  });

  test('Logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const viewPage = new ViewPage(page);
    const navigationElement = new NavigationElement(page)

    await loginPage.login()

    await expect(page).toHaveURL(loginPage.url)
    await expect(navigationElement.header).toBeVisible()

    await navigationElement.logout()

    await expect(page).toHaveURL(loginPage.url)

    await page.goto(viewPage.url);

    await expect(page).toHaveURL(loginPage.url)
    await expect(loginPage.invalidDataMessage).toHaveText(`Доступ запрещён. Пожалуйста, авторизуйтесь.`)

  });

});