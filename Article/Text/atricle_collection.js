function buildArticle(components) {
  if(!components){
    return;
  }

  let article = "";

  for (const key of Object.keys(components)) {
    try {
      const value = components[key];
      if (key.startsWith("p_")) {
        article += `<p style="font-size: medium; text-align: right;">${value}</p>`;
      } else if (key.startsWith("h2_")) {
        article += `<h2 style="font-size: x-large; text-align: right;">${value}</h2>`;
      } else if (key.startsWith("h3_")) {
        article += `<h3 style="font-size: x-large; text-align: right;">${value}</h3>`;
      } else if (key.startsWith("h4_")) {
        article += `<h4 style="font-size: x-large; text-align: right;">${value}</h4>`;
      } else if (key.startsWith("h5_")) {
        article += `<h5 style="font-size: x-large; text-align: right;">${value}</h5>`;
      } else if (key.startsWith("h6_")) {
        article += `<h6 style="font-size: x-large; text-align: right;">${value}</h6>`;
      } else if (key === "h1") {
        // h1 is used as title, not included in article body
      }
    } catch (err) {
      console.log(`Error processing key "${key}":`, err.message);
      continue; // Continue with next key instead of returning
    }
  }
  if(article ===""){
    return;
  }
  return article;
}


export default  buildArticle;