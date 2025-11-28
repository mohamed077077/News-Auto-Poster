import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LAST_ARTICLES_FILE = path.join(__dirname, "LastArticles.json");

function readStore() {
  if (!fs.existsSync(LAST_ARTICLES_FILE)) {
    return {};
  }

  try {
    const fileContent = fs.readFileSync(LAST_ARTICLES_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("Error reading LastArticles.json:", err.message);
    return {};
  }
}

function writeStore(data) {
  try {
    fs.writeFileSync(
      LAST_ARTICLES_FILE,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Error writing LastArticles.json:", err.message);
  }
}

function writeLastArticle(key, value) {
  const data = readStore();
  data[key] = value;
  writeStore(data);
}

function getLastArticles() {
  const data = readStore();
  return Object.values(data);
}

export { getLastArticles, writeLastArticle };
