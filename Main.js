import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import processArticle from "./Article/processArticle.js";
import { getLastArticles, writeLastArticle } from "./LastArticles/handleLastArticles.js";
import openBrowser from "./Browser.js";
import isOnline from "is-online";
import {
  SECTIONS,
  SELECTOR_TIMEOUT,
  LOOP_DELAY,
  RETRY_DELAY,
} from "./config.js";

async function runAutomation(page) {
  while (true) {
    if (await isOnline()) {
      const postedArticles = getLastArticles();

      for (const [label, sectionUrl] of Object.entries(SECTIONS)) {
        try {
          await page.goto(sectionUrl, { waitUntil: "domcontentloaded" });
        } catch (err) {
          console.error(`Section URL not reachable (${label}):`, err.message);
          continue;
        }

        let articleUrl;
        try {
          await page.waitForSelector("#paging >div>a", {
            timeout: SELECTOR_TIMEOUT,
          }

        );
        const href = await page.getAttribute("#paging >div>a", "href");
        articleUrl = `https://www.youm7.com${href}`;

        } catch (err) {
          console.error(`Article link missing (${label}):`, err.message);
          continue;
        }

        if (postedArticles.includes(articleUrl)) {
          console.log(`Already posted: ${articleUrl}`);
          continue;
        }

        writeLastArticle(label, articleUrl);
        await processArticle(page, articleUrl, label);
      }

      console.log("Loop finished, waiting before next iteration...");
      await page.waitForTimeout(LOOP_DELAY);
    } else {
      console.log("Internet connection error, retrying...");
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

async function main() {
  const page = await openBrowser();
  if (!page) return;

  await runAutomation(page);
}

main();

