import fs from "fs";
import uploadToDrive from "./uploadToDrive.js";
import buildImageTag from "./imageTag.js";
import makeImage from "./makeImage.js";

async function Image(text) {
  
  // Step 1 make image & validation
  const filePath = await makeImage(text);
  if (!filePath) return ;
  

  // Step 2 Upload to drive  & validation
  const driveResult = await uploadToDrive( filePath);
  if (!driveResult) return ;



  //Step 3 delete image locally
  try {
    fs.unlinkSync(filePath);
  } catch (unlinkErr) {
    console.warn(
      `⚠️ Could not delete local file ${filePath}:`,
      unlinkErr.message
    );
  }

  // Step 4 make image tag & return it 
  return buildImageTag(driveResult, text);
}

export default Image;

