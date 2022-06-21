const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();
  await page.goto("https://anchor.fm/login");
  await page.type("#email", "contact@encounterthetruth.org");
  await page.type("#password", "JonathanGriffiths2020");

  //Submit Button
  await page.click(".css-1bwv8cc");
  await page.waitForTimeout(5000);

  //New episode
  await page.click(".css-1t72zze");

  //Quick Upload and File Selection
  const [filechooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click(".css-ipuusd"),
  ]);
  filechooser.accept(["July 17, 2022.mp3"]);
  await page.waitForTimeout(5000);

  //Enter Title & Description
  await page.type("#title", "This is a test");
  await page.type(".public-DraftEditor-content","Testing");

  //Schedule Date
  
})();
