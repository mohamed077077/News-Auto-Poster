import fs from "fs";
import path from "path";
import { google } from "googleapis";
import authorize from "../../GoogleIntegration/authorization.js";

async function retryWithBackoff(fn, { retries = 3, initialDelay = 500 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.warn(`Retry ${attempt}/${retries} after error: ${err && err.code ? err.code : ''} ${err && err.message ? err.message : err}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}


async function uploadToDrive(filePath) {


  // Define FileName & upload photo with webp extention
  const fileName = path.basename(filePath);
  const fileMimeType = "image/webp";

  // authorization with retry
  let auth;
  try {
    auth = await retryWithBackoff(() => authorize(), { retries: 3, initialDelay: 500 });
  } catch (err) {
    console.log("❌ Authorization error:", err && err.message ? err.message : err);
    return;
  }

  // Initialize GoogleDrive
  let drive;
  try {
    drive = google.drive({ version: "v3", auth ,timeout: 60000});
  } catch (err) {
    console.log("❌ Driver Authorization failed:", err);
    return;
  }

  // Response with retry
  let res;
  try {
    res = await retryWithBackoff(() =>
      drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: fileMimeType,
        },
        media: {
          mimeType: fileMimeType,
          body: fs.createReadStream(filePath),
        },
        fields: "id, webViewLink, webContentLink",
      }),
      { retries: 3, initialDelay: 500 }
    );
  } catch (err) {
    console.log("❌ Image upload to Drive failed:", err && err.message ? err.message : err);
    return;
  }

  // define fileId
  const fileId = res.data.id;

  // Make the file publicl
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  } catch (err) {
    console.log("❌ Failed to set file permissions:", err);
      return;
  }
  
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`;
}

export default uploadToDrive;

