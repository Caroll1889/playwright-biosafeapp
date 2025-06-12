import { Page, Locator, expect } from '@playwright/test';


export default class LoginPage {
    readonly page: Page;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.loginEmailInput = page.getByTestId('email-input');
        this.loginPasswordInput= page.getByTestId('password-input'); 
        this.loginButton = page.getByTestId('login-button');
    }
}