import scrapeArticle from "./Text/Scrape.js";
import rewriteComponents from "./Text/rewrite.js";
import buildArticle from "./Text/atricle_collection.js";
import Image from "./Image/Image.js";
import publishToBlogger from "./bloggerPublisher.js";

const processArticle = async (page, url, label) => {
  // Scrape article
  const components = await scrapeArticle(page, url);
  if (!components) return ;
  
  // Rewrite article
  const rewriteedComponents = await rewriteComponents(page, components);
  if (!rewriteedComponents) return ;
  

  // Build article HTML
  const article = buildArticle(rewriteedComponents);
  if (!article) return ;
  

  // Generate image
  const img = await Image(String(rewriteedComponents.h1));
  if (!img) return ;

  // Publish to Blogger
  await publishToBlogger(rewriteedComponents.h1, article, img, label);
};

export default processArticle;
