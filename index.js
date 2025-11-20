const { setCookies } = require("./helper.js");
const { launchBrowser } = require("./browser.js");
const { linkedInCookies } = require("./cookies.js");

const USE_BROWSERCLOUD = true;
const HEADLESS = false;

const TOKEN = "API_TOKEN_OLEG";

const COOKIES = linkedInCookies;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ---- MAIN FUNCTION ----
(async () => {
  let browser = await launchBrowser(USE_BROWSERCLOUD, HEADLESS, TOKEN);

  // ---- Create Page ----
  const page = await browser.newPage();
  await page.setDefaultTimeout(30000);
  await page.setDefaultNavigationTimeout(30000);

  console.log("Browser launched. Navigating to linkedin.com...");
  await page.goto("https://linkedin.com");

  await sleep(2000);
  await page.screenshot({path: `./mainpage.png`});

  await setCookies(page, COOKIES);
  await page.goto("https://linkedin.com/jobs/search");
  await sleep(2000);
  await page.screenshot({path: `./search.png`});

  console.log("Done. Closing browser in 5 seconds...");
  setTimeout(async () => {
    await browser.close();
    console.log("Browser closed");
  }, 5000);
})();
