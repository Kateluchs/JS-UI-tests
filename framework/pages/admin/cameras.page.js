import config from '../../config/config';
//import fetch from 'node-fetch';


export class CamerasPage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;

        // URL
        this.url = `${config.baseUrl}/d/admin`

        this.notFoundMessage = page.locator('p[class*=NotFound_title]')
        this.mainContainer = page.locator('div[class*=SectionContainer_main]')
        this.tableHeader = page.getByText('Название / IPВендор / МодельПотокиАрхивДетекторыЛицензия')
        this.tooltip = page.locator('div[class*=PopperTooltip_tooltip-container]')

        // Page buttons
        this.addCamButton = page.locator('button[class*=Button_main]');
        this.addCamSearchButton = page.locator('div[class*=NotFound_buttons]').locator('button[class*=Button_main]');

        this.searchInput = page.locator('button[type="text"]');

        this.enableAdvancedSearch = page.locator('div[class*=TextUnderline_text]').filter({ hasText: 'Включить расширенный поиск' });
        this.infoAdvancedSearch = page.locator('div[class*=TextUnderline_text]').filter({ hasText: 'Подробнее о синтаксисе' });
        this.disableAdvancedSearch = page.locator('div[class*=TextUnderline_text]').filter({ hasText: 'Вернуться к простому поиску' });
        this.bulkDeleteButton = page.getByText('Удалить')

        // Choose cameras modal

        this.noMyCamButton = page.locator('span[class*="AutoDiscover_footerButtons"] > button[class*=Button_outline]');
        this.continueButton = page.locator('span[class*="AutoDiscover_footerButtons"] > button[class*=Button_main]');
        this.observerNotFound = page.locator('p[class*="AutoDiscover_notFound__info"]')
        this.findButton = page.locator('div[class*="AutoDiscover_leftSideButtons"]').locator('button[type="submit"]')
        this.refreshButton = page.locator('div[class*="AutoDiscover_leftSideButtons"]').locator('button[type="button"]')

        // Set up connection: add camera manually

        this.cameraNameInput = page.locator('input[type="name"]');
        this.cameraHostInput = page.locator('input[type="host"]');
        this.advancedSettings = page.locator('label[for="advancedCheckbox"]');
        this.vendorSelectInput = page.locator('div[label="Вендор"]');
        this.furtherButton = page.locator('button[type="submit"]');
        this.doneButton = page.locator('div[class*=Screen_footer] > button[class*=Button_main]');
        this.otherVendorSelect = page.getByText('Другой вендор', { exact: true });
        this.modalWindow = page.locator('div[class*=ModalNormal_content]');

        // Modal delete camera

        this.modalDeleteButton = page.locator('div[class*="ModalNormal_modal"]').locator('button[class*="Button_main"]');


    }
    async goto() {
        await this.page.goto(this.url);
    }

    async cameraElement(camId){
        return(this.page.locator(`div[data-id="${camId}"]`))
    }

    async cameraDeleteButton(camId) {
        return (this.page.locator(`div[data-id="${camId}"]`).locator('button[class*="List_delete"]'))
    }

    async cameraCheckbox(camId) {
        return (this.page.locator(`div[data-id="${camId}"]`).locator('span[class*="Checkbox_container"]'))
    }

    async discoveryItem(camIPmodel) {
        return(this.page.getByText(`${camIPmodel}`))
    }

    async cameraIndicator(camId, span){
        return(this.page.locator(`div[data-id="${camId}"]`).locator(`span:nth-child(${span+3}) > div`))
    }


    async interceptDiscoveryRequest(data) {

    //  await this.page.route('*/**/api/webclient/cameras/discovery', async route => {
     //       const response = await route.fetch();
     //       await route.fulfill({ response, data });
     //   })

    }


}