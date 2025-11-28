import fs from "fs";
import { google } from "googleapis";
import { fileURLToPath } from "url";
import path,{ dirname } from "path";  


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CREDENTIALS_PATH = path.join(__dirname, "TookenCreation", "credentials.json");
const TOKEN_PATH = path.join(__dirname, "TookenCreation", "token.json");

async function authorize() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`credentials file not found at ${CREDENTIALS_PATH}`);
  }

  const rawCreds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const clientConfig = rawCreds.installed || rawCreds.web;
  if (!clientConfig) {
    throw new Error(
      `credentials.json does not contain 'installed' or 'web' client config`
    );
  }

  const { client_secret, client_id, redirect_uris } = clientConfig;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKEN_PATH)) {
    try {
      oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")));
      return oAuth2Client;
    } catch (err) {
      throw new Error(`Failed to read token file at ${TOKEN_PATH}: ${err.message}`);
    }
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
scope: [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/blogger"
],
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  throw new Error("Run this script separately to save token.json first!");
}

export default authorize;