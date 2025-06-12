import { test, expect } from '@playwright/test';
import data from '../data/users.json'; // Importa los datos de prueba desde un archivo JSON 
import Homepage from '../pages/Homepage';
import SignupPage from '../pages/SignupPage';
import { getVerificationCode } from '../utils/gmailUtils';
import VerificationEmailPage  from '../pages/VerificationEmailPage';
import LoginPage from '../pages/LoginPage'; 


let homepage: Homepage;
let signupPage: SignupPage;
let verificationEmailPage: VerificationEmailPage;
let loginPage: LoginPage;

test('Registro exitoso', async ({ page }) => {
  homepage = new Homepage(page);
  signupPage = new SignupPage(page);
  verificationEmailPage = new VerificationEmailPage(page);
  loginPage = new LoginPage(page);

  await page.goto('https://qa.biosafeapp.com/');
  await homepage.goToregistrationPage(); // Llama al metodo goToregistrationPage de la clase Homepage para ir a la pagina de registro
  const uniqueEmail = await signupPage.registerUser(data.users.correcto); // Llama al metodo registerUser de la clase SignupPage para registrar un usuario
  await expect(page).toHaveURL('https://qa.biosafeapp.com/verify-email'); // Verifica que la URL sea la correcta después del registro
  
  const verificationCode = await getVerificationCode(); // Llama a la funcion getVerificationCode para obtener el código de verificación del correo
  
  console.log("Código de verificación:", verificationCode)
  await verificationEmailPage.verificationCodeInput.fill(verificationCode); // Llama al metodo getVerificationCode para obtener el código de verificación del correo
  await verificationEmailPage.verifyEmailButton.click(); // Llama al metodo verifyEmailButton para hacer click en el boton de verificar correo
  await page.waitForTimeout(2000); // Espera 2 segundos para que el mensaje de verificación se muestre correctamente
  await expect(verificationEmailPage.successverificationMessage).toBeVisible(); // Verifica que el mensaje de verificación exitoso sea visible
  await expect(page).toHaveURL('https://qa.biosafeapp.com/login'); // Verifica que la URL sea la correcta después del registro
  
  await loginPage.loginEmailInput.fill(uniqueEmail); // Llama al metodo loginEmailInput de la clase LoginPage para ingresar el email del usuario registrado
  await loginPage.loginPasswordInput.fill(data.users.correcto.password); // Llama al metodo loginPasswordInput de la clase LoginPage para ingresar la contraseña del usuario registrado
  await loginPage.loginButton.click(); // Llama al metodo loginButton de la clase LoginPage para hacer click en el boton de login
  await expect(page).toHaveURL('https://qa.biosafeapp.com/dashboard'); // Verifica que la URL sea la correcta después del registro
});

