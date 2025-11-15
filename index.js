const { setCookies } = require("./helper.js");
const { launchBrowser } = require("./browser.js");

const USE_BROWSERCLOUD = false;
const HEADLESS = false;

const TOKEN = "";

const COOKIES = [];



// ---- MAIN FUNCTION ----
(async () => {
  let browser = await launchBrowser(USE_BROWSERCLOUD, HEADLESS, TOKEN);

  // ---- Create Page ----
  const page = await browser.newPage();
  await page.setDefaultTimeout(30000);
  await page.setDefaultNavigationTimeout(30000);

  console.log("Browser launched. Navigating to linkedin.com...");
  await page.goto("https://linkedin.com");
  await setCookies(page, COOKIES);
  await page.goto("https://linkedin.com/jobs/search");

  console.log("Done. Closing browser in 5 seconds...");
  setTimeout(async () => {
    await browser.close();
    console.log("Browser closed");
  }, 5000);
})();
