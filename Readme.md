# How are we using Browsercloud

A simple Node.js + Puppeteer setup to demonstrate how we use Browsercloud in our application.

# 🚀 Installation

```bash
git clone <your-repo-url>
cd <project-folder>
npm install 
```

# Getting Cookies 
## Export LinkedIn Cookies from Cookie Editor
- Go to linkedin.com and log in.
- Install the Cookie-Editor extension.
- Export cookies as JSON.
- Paste them inside the COOKIES array in index.js.

Example -
```bash
const COOKIES = [
  {
    name: "li_at",
    value: "your_li_at_value",
    domain: ".linkedin.com"
  },
  {
    name: "JSESSIONID",
    value: "your_value",
    domain: ".linkedin.com"
  }
];
```
# Running Locally
#### Set config as below -
```bash
const USE_BROWSERCLOUD = false;
const HEADLESS = false;
```
#### Run the Script
```bash
npm run test
```

# Running with BrowserCloud
#### Set config as below -
```bash
const USE_BROWSERCLOUD = true;
const HEADLESS = true;
const TOKEN = <browsercloud token>;
```
#### Run the Script
```bash
npm run test
```

## What happens:
- Puppeteer launches Chrome
- Navigates to LinkedIn
- Loads the cookies
- Goes to the LinkedIn Jobs page
- Closes the browser after some delay

## How to Verify Cookie Validity
- Repeat this process 2–3 times and then refresh the LinkedIn page (the same page you originally extracted the cookies from). If it logs you out, the cookies have expired; if not, the cookies are still valid.

## Project Structure
```bash
/project
  ├── index.js        # Main script
  ├── browser.js      # Local + BrowserCloud launcher
  ├── helper.js       # setCookies helper
  └── package.json
```
