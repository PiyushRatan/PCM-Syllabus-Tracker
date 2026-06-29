const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  console.log("Navigating to old UI...");
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  await page.goto('https://pcm-syllabus-tracker.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // give it a little time to render
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'screenshots/old_ui.png', fullPage: true });
  await browser.close();
  console.log("Screenshot saved at screenshots/old_ui.png");
})();
