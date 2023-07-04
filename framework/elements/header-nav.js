import { expect } from '@playwright/test';
import config from '../config/config';

export class NavigationElement {

    constructor(page) {
        this.page = page;

        // Menu content
        this.header = page.locator('header[class^=Header_header]');
        this.logoutButton = page.locator('i[class^=icons_icon-logout]');

    }

    async logout() {
        await this.logoutButton.click();
      }
}