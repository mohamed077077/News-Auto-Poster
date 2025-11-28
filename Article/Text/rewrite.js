
const REWRITER_URL = "https://ralfvanveen.com/en/tools/ai-rewriter-to-human/";
const SELECTOR_TIMEOUT = 20000;
const SUGGESTIONS_TIMEOUT = 10000;
const EMPTY_TEXTAREA_DELAY = 2000;

const fillValue = async (page, value) => {
    const inputBox = await page.waitForSelector("textarea", { timeout: SELECTOR_TIMEOUT });
    await inputBox.fill(value);
};

const clickGenerate = async (page) => {
    const rewriteButton = await page.waitForSelector("button:has-text('Generate')", { timeout: SELECTOR_TIMEOUT });
    await rewriteButton.click();
};

const addNewText = async (page, components, key) => {

    await page.waitForFunction(() => {
      const el = document.querySelector("div[id*='suggestions']");
      return el && el.textContent.trim().length > 0;
    }, { timeout: SUGGESTIONS_TIMEOUT });

    const newText = await page.textContent("div[id*='suggestions']");
    components[key] = newText.trim();
};

const emptyTextArea = async (page) => {
    const inputBox = await page.waitForSelector("textarea", { timeout: SELECTOR_TIMEOUT });
    await inputBox.fill("");
};


async function rewriteComponents(page, components) {
  // Go to rewriter
  try {
    await page.goto(REWRITER_URL, { waitUntil: "domcontentloaded" });
  } catch (err) {
    console.error("Rewrite URL is not reachable:", err.message);
    return ;
  }

  for (const key of Object.keys(components)) {
    const value = components[key];

    // Fill input by value
    try{
      await fillValue(page, value);
    }catch{
      console.error("Error filling input box:", err.message);
      return;
    }


    // Click rewrite
    try{
      await clickGenerate(page);
    }catch{
      console.error(`Failed to click rewrite button for key "${key}"`);
      return;
    }

    // Update components with new text
    try{
    await addNewText(page, components, key);
    }catch{
      console.error(`Failed to get new text for key "${key}"`);
      return;
    }

    // Empty textarea
    try{
     await emptyTextArea(page);
    }catch{
      console.warn(`Failed to empty textarea for key "${key}", continuing...`);
      return;
    }
    
    // Delay before next paragraph
    await page.waitForTimeout(EMPTY_TEXTAREA_DELAY);    

  }

  return components;
}

export default rewriteComponents;