import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createCanvas } from "canvas";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



async function makeImage(text, width = 1200, height = 628) {
  const outputPath = path.join(__dirname, "image.png");
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // set backgroud style
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#d24949");
    gradient.addColorStop(1, "#9e44c9");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // set text style and wrapping
    ctx.fillStyle = "white";
    const fontFamily = "Arial, sans-serif";

    // shadow for better contrast
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // dynamic font sizing and wrapping
    let fontSize = Math.min(64, Math.floor(width / 18));
    const maxWidth = width - 140; // horizontal padding
    const maxLines = 6;

    function getLinesForSize(size) {
      ctx.font = `${size}px ${fontFamily}`;
      const words = String(text).split(/\s+/).filter(Boolean);
      const lines = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        const metrics = ctx.measureText(test);
        if (metrics.width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      return lines;
    }

    // reduce font size until text fits within allowed lines
    let lines = getLinesForSize(fontSize);
    while ((lines.length > maxLines || (lines.length === 1 && ctx.measureText(lines[0]).width > maxWidth)) && fontSize > 18) {
      fontSize -= 2;
      lines = getLinesForSize(fontSize);
    }

    // vertical placement
    const lineHeight = Math.ceil(fontSize * 1.25);
    const blockHeight = lines.length * lineHeight;
    const startY = height / 2 - blockHeight / 2 + lineHeight / 2;

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px ${fontFamily}`;

    // render each line
    for (let i = 0; i < lines.length; i++) {
      const y = startY + i * lineHeight;
      ctx.fillText(lines[i], width / 2, y);
    }

    // save image locally
    const buffer = canvas.toBuffer("image/png");
    // validate buffer before writing
    if (!buffer || !Buffer.isBuffer(buffer)) {
      console.log('❌ Invalid buffer returned from canvas.toBuffer', buffer);
      throw new Error('canvas.toBuffer returned invalid data');
    }
    fs.writeFileSync(outputPath, buffer);
    // return path
    return outputPath;
    
  } catch (err) {
    console.log("❌ IMG creation failed:", err && err.message ? err.message : err);
    return;
  }
}


export default makeImage;
