import { Page, Locator, expect } from '@playwright/test';


export default class Homepage {
    readonly page: Page;
    readonly botonRegistrarse: Locator;

    constructor(page: Page) {
        this.page = page;
        this.botonRegistrarse = page.getByRole('link', { name: 'Registrarse' }).first();
    }

    async goToregistrationPage() {
        await this.botonRegistrarse.click({ force: true }); // Click en el boton de registrarse, forzando el click
        expect(this.page).toHaveURL('https://qa.biosafeapp.com/signup'); // Verifica que la URL sea la correcta
    }
}