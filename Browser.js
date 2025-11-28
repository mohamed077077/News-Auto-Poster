import { chromium } from "playwright";

const openBrowser = async () => {
    try {
      const browser = await chromium.launch({ headless: false });
      const context = await browser.newContext();
      const page = await context.newPage();
      return page;
    } catch (err) {
      console.error("Browser can't be opened:", err.message);
      return ;
    }
  };


export default openBrowser;
