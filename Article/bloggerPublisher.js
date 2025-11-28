import { google } from "googleapis";
import authorize from "../GoogleIntegration/authorization.js";

const BLOG_ID = "8784583295316048833";

async function publishToBlogger(title, content, img, label) {

  // authorization
  let auth;
  try {
    auth = await authorize();
  } catch (err) {
    console.error("Blogger Authorization failed:", err.message);
    return ;
  }

  // Initialize Blogger
  let blogger;
  try {
    blogger = google.blogger({ version: "v3", auth });
  } catch (err) {
    console.error("Failed to init Blogger API:", err.message);
    return ;
  }

  // Initialize GoogleDrive
  let res;
  try {
    res = await blogger.posts.insert({
      blogId: BLOG_ID,
      requestBody: {
        kind: "blogger#post",
        title,
        content: `${img}\n\n${content}`,
        labels: [label]
      },
    });
  } catch (err) {
      console.error("Error publishing post:", err.message);
      return ;
    }

  console.log("✅ Post published:", res.data.url);
  return res.data.url;
  }

export default publishToBlogger;