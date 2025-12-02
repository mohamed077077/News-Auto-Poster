# Project Overview

This project is a Node.js-based automation tool that handles:
- Scraping new articles from different sections
- Processing and rewriting text
- Generating and uploading images automatically
- Publishing posts directly to Blogger
- Managing recent posts to avoid duplicates
____

## 🚀 Getting Started

### **1. Install Dependencies**
```bash
npm install
```
### 2. Configuration

Make sure you have your Google API credentials in:

```bash
GoogleIntegration/TookenCreation/credentials.json
GoogleIntegration/TookenCreation/token.json
```

### 3. Run the Project
```bash
node Main.js
```
____
# project structure

```bash
├── Article
│   ├── bloggerPublisher.js
│   ├── Image
│   │   ├── Image.js
│   │   ├── image.png
│   │   ├── imageTag.js
│   │   ├── makeImage.js
│   │   └── uploadToDrive.js
│   ├── processArticle.js
│   └── Text
│       ├── atricle_collection.js
│       ├── rewrite.js
│       └── Scrape.js
├── Browser.js
├── config.js
├── .gitattributes
├── GoogleIntegration
│   ├── authorization.js
│   └── TookenCreation
│       ├── credentials.json
│       ├── Genrate-Token.js
│       └── token.json
├── LastArticles
│   ├── handleLastArticles.js
│   └── LastArticles.json
├── Main.js
├── package.json
├── package-lock.json
```
