import { expect } from '@playwright/test';
import config from '../config/config';

export class ViewPage {
    
    constructor(page){
        this.page = page;
    
        // URL
    this.url = `${config.baseUrl}/d/`
    }
}