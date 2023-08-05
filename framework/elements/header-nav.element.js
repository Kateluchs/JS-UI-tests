import { expect } from '@playwright/test';
import config from '../config/config';

export class NavigationElement {

    constructor(page) {
        this.page = page;

        // Menu content
        this.header = page.locator('header[class^=Header_header]');
        

        this.logoutButton = page.locator('i[class^=icons_icon-logout]');
        this.clockDate = page.locator('div[class^=Clock_ClockDate]');
        this.clockTime = page.locator('div[class^=Clock_ClockTime]');
        this.infoButton = page.locator('a[class*=Header_header_navlink__question]');
        this.userButton = page.locator('a[class*=Header_header_navlink__user]');
        
        this.adminButton = page.locator('a[href="/d/admin"]');
        this.reportsButton = page.locator('a[href="/d/reports"]');
        this.mapsButton = page.locator('a[href="/d/maps"]');
        this.eventsButton = page.locator('a[href="/d/alarms"]');
        this.viewButton = page.locator('a[href="/d/"]');
    }

    async logout() {
        await this.logoutButton.click();
    }

    async gotoUser() {
        await this.userButton.click();
    }

    async getInfo() {
        await this.infoButton.click();
    }

    async gotoAdmin() {
        await this.adminButton.click();
    }
    async gotoReports() {
        await this.reportsButton.click();
    }
    async gotoMaps() {
        await this.mapsButton.click();
    }
    async gotoEvents() {
        await this.eventsButton.click();
    }
    async gotoView() {
        await this.viewButton.click();
    }

}