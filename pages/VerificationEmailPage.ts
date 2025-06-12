import { Page, Locator, expect } from '@playwright/test';


export default class VerificationEmailPage {
    readonly page: Page;
    readonly verificationCodeInput: Locator;
    readonly verifyEmailButton: Locator;
    readonly successMessage: Locator;
    readonly successverificationMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.verificationCodeInput = page.getByTestId('input-verification-code');
        this.verifyEmailButton = page.getByTestId('btn-verify-email');
        this.successverificationMessage = page.getByText('¡Correo verificado exitosamente!');
    }
}