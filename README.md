Auto-News-Poster/
├── Main.js                          # Main entry point
├── postOnBlogger.js                 # Blogger publishing module
├── LastArticles.json               # Tracks posted articles
├── package.json                     # Dependencies
│
├── Article/
│   ├── Scrape.js                   # Web scraping logic
│   ├── rewrite.js                  # Article rewriting using AI tool
│   ├── atricle_collection.js       # Builds HTML article from components
│   └── IMG_Creation/
│       ├── image.js                # Image generation & Google Drive upload
│       └── textToImage.html        # HTML for image generation
│
└── GoogleIntegration/
    ├── authorization.js            # Google OAuth setup
    └── TookenCreation/
        └── Genrate-Token.js       # Token generation script
        └── credentials.json  
        └── Token.json        