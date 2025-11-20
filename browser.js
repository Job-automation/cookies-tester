let puppeteer = null;

async function loadPuppeteerWithStealth(USE_BROWSERCLOUD) {
  if (puppeteer) return puppeteer;

  try {
    if (USE_BROWSERCLOUD) {
      console.log("Running in Lambda environment");

      const puppeteerCore = await import("puppeteer-core");
      puppeteer = puppeteerCore.default; // puppeteer-core has no bundled Chromium
    } else {
      console.log("Running locally with stealth plugins");

      const { addExtra } = await import("puppeteer-extra");
      const StealthPlugin = (await import("puppeteer-extra-plugin-stealth"))
        .default;
      const UserPreferencesPlugin = (
        await import("puppeteer-extra-plugin-user-preferences")
      ).default;
      const puppeteerBase = (await import("puppeteer")).default;

      puppeteer = addExtra(puppeteerBase);
      puppeteer.use(StealthPlugin());
      puppeteer.use(UserPreferencesPlugin({ userPrefs: {} }));
    }
  } catch (err) {
    console.error("Failed to load puppeteer with stealth:", err);
    console.log("Falling back to plain puppeteer...");

    const plain = await import("puppeteer");
    puppeteer = plain.default;
  }

  return puppeteer;
}

async function launchBrowser(USE_BROWSERCLOUD, HEADLESS, TOKEN) {
  let browser;
  let puppeteer = await loadPuppeteerWithStealth(USE_BROWSERCLOUD);
  if (USE_BROWSERCLOUD) {
    const params = new URLSearchParams({
      token: TOKEN,
      timeout: `${5 * 60 * 1000}`,
      stealthMode: "stealth-v2",
      blockRes: "off",
      // proxy: "datacenter",
      // proxyCountry : "US"
    });

    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome-v2.browsercloud.io?${params.toString()}`,
      defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
    });
  }

  // ---- LOCAL MODE (Normal Puppeteer) ----
  else {
    browser = await puppeteer.launch({
      headless: HEADLESS,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--window-size=1920,1080",
      ],
      defaultViewport: { width: 1920, height: 1080 },
      timeout: 30000,
    });
  }
  return browser;
}

module.exports = { loadPuppeteerWithStealth, launchBrowser };
