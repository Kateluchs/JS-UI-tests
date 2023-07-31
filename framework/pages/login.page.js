import { expect } from '@playwright/test';
import config from '../config/config';


export class LoginPage {

  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;

    // URL
    this.url = `${config.baseUrl}/d/login`

    // Inputs and Buttons
    this.loginInput = page.locator('input[name="loginName"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.resetPassButton = page.locator('button[class*=Login_forgotPasswordButton]');
    this.eyeButton = page.locator('i[class*=icons_icon-password]');

    // Inputs first user
    this.newPasswordInput = page.locator('input[name="newPassword"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');

    this.newPasswordEyeButton = page.locator('label').filter({ hasText: 'Создайте пароль' }).locator('i');
    this.confirmPasswordEyeButton = page.locator('label').filter({ hasText: 'Подтвердите пароль' }).locator('i');
 

    // First user messages
    this.adminLoginInputErrorMessage = page.locator('label:has-text("Создайте логин Администратора")').locator('span[class*=Input_spanError]');
    this.newPasswordErrorMessage = page.locator('label:has-text("Создайте пароль")').locator('span[class*=Input_msgError]');
    this.confirmPasswordErrorMessage = page.locator('label:has-text("Подтвердите пароль")').locator('span[class*=Input_msgError]');
    
    this.toggle = page.locator('span[class*=Switch_slider]')


    // Messages and Errors
    this.loginInputErrorMessage = page.locator('label:has-text("Логин") > span > span[class*=Input_spanError]');
    this.passwordInputErrorMessage = page.locator('label:has-text("Пароль") > span[class*=Input_msgError]');
    this.notSupportBrowserMessage = page.locator('div[class*=NotSupportBrowser_message]')

    this.invalidDataMessage = page.locator('div[class^=Login_error_message]');
    this.resetPassMessage = page.locator('div[class^=Login_warning_message]');
    this.resetPassLink = page.locator('a[class^=Login_link]');

  }

  async goto() {
    await this.page.goto(`${config.baseUrl}/d/login`);
  }



  async login(login = config.credentials.login, password = config.credentials.password) {
    await this.goto()
    await this.loginInput.click()
    await this.loginInput.fill(login)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }


}