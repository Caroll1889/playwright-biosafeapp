import { Page, Locator, expect } from '@playwright/test';


export default class PaginaSignup {
    readonly page: Page;
    readonly inputName: Locator;
    readonly inputEmail: Locator;
    readonly inputPassword: Locator;
    readonly passwordConfirmation: Locator;
    readonly registrationButton: Locator;
    readonly SuccessfulMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputName = page.getByTestId('nameInput');
        this.inputEmail = page.getByTestId('emailInput');
        this.inputPassword = page.getByTestId('passwordInput');
        this.passwordConfirmation = page.getByTestId('confirmPasswordInput');
        this.registrationButton = page.getByTestId('botonRegistro')
        this.SuccessfulMessage = page.getByText('¡Registro exitoso! Revisa tu')
    }

    async registerUser(user: any): Promise<string> {
        const uniqueEmail = user.email.replace('@', `+${Date.now()}@`); // Genera un email único para evitar conflictos
        await this.inputName.fill(user.name);
        await this.inputEmail.fill(uniqueEmail); // Utiliza el email único generado
        await this.inputPassword.fill(user.password);
        await this.passwordConfirmation.fill(user.password);
        await this.registrationButton.click(); // Click en el boton de registro
        await this.page.waitForTimeout(1000); // Espera 2 segundos para que el mensaje se muestre correctamente
        await expect(this.SuccessfulMessage).toBeVisible(); // Verifica que el mensaje de registro exitoso sea visible
        await expect(this.SuccessfulMessage).not.toBeVisible();
        return uniqueEmail; // Devuelve el email único utilizado para el registro
    }
}