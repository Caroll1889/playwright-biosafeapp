import { google, Auth } from 'googleapis';
import fs from 'fs';
import path from 'path';


const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const CREDENTIALS_PATH = path.join(__dirname, '../data/credentials.json');
const TOKEN_PATH = path.join(__dirname, '../data/token.json');


export async function authenticate(): Promise<Auth.OAuth2Client> {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error("No se encontró credentials.json en ./data. Descarga las credenciales de Google Cloud.");
    }

    const credentialsRaw = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    const credentials = credentialsRaw.installed || credentialsRaw.web;
    const { client_id, client_secret, redirect_uris } = credentials;

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (!fs.existsSync(TOKEN_PATH)) {
        throw new Error("No se encontró token.json. Primero ejecuta 'npx tsx generateToken.ts para generarlo'");
    }

    console.log("Cargando token desde token.json")
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);
    console.log("Token cargado correctamente");

    return oAuth2Client;
}

export async function getVerificationCode(): Promise<string> {
    try {
        // Autenticamos al usuario usando el token generado
        const auth = await authenticate();
        const gmail = google.gmail({ version: 'v1', auth })

        console.log("Buscando el codigo de verificación en los correos...")

        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'from:soporte@biosafeapp.com subject: "Código de verificación de BioSafeApp"',
            maxResults: 1
        });

        if(!response.data.messages || response.data.messages.length === 0) {
            console.error("No se encontraron correos con el código de verificación");
            return '';
        }
        
        const messageId = response.data.messages[0].id!;
        const message = await gmail.users.messages.get({userId: 'me', id: messageId});

        const body = message.data.snippet || '';
        console.log("cuerpo del correo: ", body); 

        //Buscamos un numero de 6 digitos en el cuerpo del correo
        const codeMatch = body.match(/\b\d{6}\b/);
        if(!codeMatch) {
            console.error("no se encontró un código de verificación de 6 digitos en el correo")
            return '';
        } else {
            return codeMatch[0]; 
        }
    } catch(error) {
        console.error("Error obteniendo el código de verificación: ", error);
        return ''; 
    }
}