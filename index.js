const puppeteer = require("puppeteer");
require("dotenv").config();

const weeklyUploadsInformation = [
  {
    title: "The Eternal God (Part 1 of 2) | Who Is Like Our God?",
    description:
      "Many of our difficulties in the Christian life stem from the fact that we don't really know God as we ought to know him. Our view of God is too small—too domesticated—too much formed by personal opinion and cultural assumption—and not nearly enough formed by the teaching of the Scriptures, through which God has made himself known. We begin this new series on the eternity of God—the truth that God in his being transcends time and is uniquely eternal. This is a vital truth for us to explore.",
    day: "23",
    monthWord: "Jun",
    monthNum: "06",
    year: "2022",
    audioFile: "June 23, 2022.mp3",
    graphicFile: "Who Is Like Our God.jpg",
  },
  {
    title: "The Eternal God (Part 2 of 2) | Who Is Like Our God?",
    description:
      "Many of our difficulties in the Christian life stem from the fact that we don't really know God as we ought to know him. Our view of God is too small—too domesticated—too much formed by personal opinion and cultural assumption—and not nearly enough formed by the teaching of the Scriptures, through which God has made himself known. We begin this new series on the eternity of God—the truth that God in his being transcends time and is uniquely eternal. This is a vital truth for us to explore.",
    day: "24",
    monthWord: "Jun",
    monthNum: "06",
    year: "2022",
    audioFile: "June 24, 2022.mp3",
    graphicFile: "Who Is Like Our God.jpg",
  },
  {
    title: "The Omnipotent God (Part 1 of 2) | Who Is Like Our God?",
    description:
      "Who can understand the power of the Almighty God? None of us fully can.Our perception of the extent and greatness of his power is so limited—and it certainly is too small. Our aim in this message is simply to try and expand our view of the power of God and to move toward a more biblical proportion—to catch even a glimpse of his might from the pages of his Word.",
    day: "27",
    monthWord: "Jun",
    monthNum: "06",
    year: "2022",
    audioFile: "June 27, 2022.mp3",
    graphicFile: "Who Is Like Our God.jpg",
  },
  {
    title: "The Omnipotent God (Part 2 of 2) | Who Is Like Our God?",
    description:
      "Who can understand the power of the Almighty God? None of us fully can.Our perception of the extent and greatness of his power is so limited—and it certainly is too small. Our aim in this message is simply to try and expand our view of the power of God and to move toward a more biblical proportion—to catch even a glimpse of his might from the pages of his Word.",
    day: "28",
    monthWord: "Jun",
    monthNum: "06",
    year: "2022",
    audioFile: "June 28, 2022.mp3",
    graphicFile: "Who Is Like Our God.jpg",
  },
  {
    title: "The Unchanging God (Part 1 of 2) | Who Is Like Our God?",
    description:
      "As human beings, we are changing and declining daily; our world itself is changing and will not last. But against that rather depressing backdrop, the Psalmist proclaims the glorious truth that God himself does not change. The Lord is the Unchanging One. All else will change and decay and much will disappear. But the eternal God does not.",
    day: "29",
    monthWord: "Jun",
    monthNum: "06",
    year: "2022",
    audioFile: "June 29, 2022.mp3",
    graphicFile: "Who Is Like Our God.jpg",
  },
  {
    title: "The Unchanging God (Part 2 of 2) | Who Is Like Our God?",
    description:
      "As human beings, we are changing and declining daily; our world itself is changing and will not last. But against that rather depressing backdrop, the Psalmist proclaims the glorious truth that God himself does not change. The Lord is the Unchanging One. All else will change and decay and much will disappear. But the eternal God does not.",
    day: "30",
    monthWord: "Jun",
    monthNum: "06",
    year: "2022",
    audioFile: "June 30, 2022.mp3",
    graphicFile: "Who Is Like Our God.jpg",
  },
];

const generalTimer = 3000;
async function runAnchor(browser) {
  //Open Anchor
  for (var i = 0; i < weeklyUploadsInformation.length; i++) {
    const page = await browser.newPage();
    await page.goto("https://anchor.fm/login");
    await page.type("#email", process.env.ANCHOR_USERNAME);
    await page.type("#password", process.env.ANCHOR_PASSWORD);

    //Submit Button
    await page.click(".css-1bwv8cc");
    await page.waitForTimeout(generalTimer);

    //New episode
    await page.click(".css-1t72zze");

    //Quick Upload and File Selection
    const [filechooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click(".css-ipuusd"),
    ]);
    filechooser.accept(["audio/" + weeklyUploadsInformation[i].audioFile]);
    await page.waitForTimeout(generalTimer);

    //Enter Title & Description
    await page.type("#title", weeklyUploadsInformation[i].title);
    await page.type(
      ".public-DraftEditor-content",
      weeklyUploadsInformation[0].description
    );

    //Schedule Date
    await page.click(".gsPLMI");
    await page.waitForTimeout(generalTimer);

    await page.click(".rdtSwitch");
    await page.waitForTimeout(generalTimer);

    const [monthButton] = await page.$x(
      "//td[contains(text(),'" + weeklyUploadsInformation[i].monthWord + "')]"
    );
    if (monthButton) {
      await monthButton.click();
    }

    while (true) {
      const dateHandle = await page.evaluateHandle(() =>
        document.querySelector(".rdtDay")
      );
      let resultHandle = await page.evaluateHandle(
        (day) => day.classList[1],
        dateHandle
      );
      if ((await resultHandle.jsonValue()) === "rdtOld") {
        await page.evaluateHandle(
          () => (document.querySelector(".rdtDay").innerHTML = "na")
        );
        await page.evaluateHandle(() =>
          document.querySelector(".rdtDay").classList.remove("rdtDay")
        );
      } else {
        break;
      }
      await dateHandle.dispose();
      await resultHandle.dispose();
    }

    const [dayButton] = await page.$x(
      "//td[contains(text(),'" + weeklyUploadsInformation[i].day + "')]"
    );
    if (dayButton) {
      await dayButton.click();
    }
    await page.waitForTimeout(generalTimer);
    await page.click(".rdtTimeToggle");

    await page.waitForTimeout(generalTimer);

    const aHandle = await page.evaluateHandle(() =>
      document.querySelector(".rdtCount")
    );
    let resultHandle = await page.evaluateHandle(
      (count) => count.innerHTML,
      aHandle
    );
    while ((await resultHandle.jsonValue()) != "12") {
      await page.click(".rdtBtn");
      resultHandle = await page.evaluateHandle(
        (count) => count.innerHTML,
        aHandle
      );
      if ((await resultHandle.jsonValue()) === "12") {
        await page.evaluateHandle(() =>
          document.querySelector(".rdtCount").classList.remove("rdtCount")
        );
        await page.evaluateHandle(() =>
          document.querySelector(".rdtBtn").classList.remove("rdtBtn")
        );
        await page.evaluateHandle(() =>
          document.querySelector(".rdtBtn").classList.remove("rdtBtn")
        );
      }
    }
    await aHandle.dispose();
    await resultHandle.dispose();

    const bHandle = await page.evaluateHandle(() =>
      document.querySelector(".rdtCount")
    );
    let resultHandle2 = await page.evaluateHandle(
      (count) => count.innerHTML,
      bHandle
    );
    while ((await resultHandle2.jsonValue()) != "00") {
      await page.click(".rdtBtn");
      resultHandle2 = await page.evaluateHandle(
        (count) => count.innerHTML,
        bHandle
      );
      if ((await resultHandle2.jsonValue()) === "00") {
        await page.evaluateHandle(() =>
          document.querySelector(".rdtCount").classList.remove("rdtCount")
        );
        await page.evaluateHandle(() =>
          document.querySelector(".rdtBtn").classList.remove("rdtBtn")
        );
        await page.evaluateHandle(() =>
          document.querySelector(".rdtBtn").classList.remove("rdtBtn")
        );
      }
    }
    await bHandle.dispose();
    await resultHandle2.dispose();

    const cHandle = await page.evaluateHandle(() =>
      document.querySelector(".rdtCount")
    );
    let resultHandle3 = await page.evaluateHandle(
      (count) => count.innerHTML,
      cHandle
    );
    while ((await resultHandle3.jsonValue()) != "AM") {
      await page.click(".rdtBtn");
      resultHandle3 = await page.evaluateHandle(
        (count) => count.innerHTML,
        cHandle
      );
    }
    await cHandle.dispose();
    await resultHandle3.dispose();

    await page.waitForTimeout(generalTimer);
    const [confirmButton] = await page.$x("//div[contains(text(),'Confirm')]");
    if (confirmButton) {
      await confirmButton.click();
    }

    const [artButton] = await page.$x(
      "//button[contains(text(),'Upload new episode art')]"
    );

    const [artChooser] = await Promise.all([
      page.waitForFileChooser(),
      artButton.click(),
    ]);
    artChooser.accept(["graphic/" + weeklyUploadsInformation[i].graphicFile]);
    await page.waitForTimeout(generalTimer);
    const [saveButton] = await page.$x("//div[contains(text(),'Save')]");
    if (saveButton) {
      await saveButton.click();
    }

    await page.waitForTimeout(10000);
    const [scheduleButton] = await page.$x(
      "//div[contains(text(),'Schedule episode')]"
    );
    if (scheduleButton) {
      await scheduleButton.click();
    }
    await page.close();
  }
}

async function runSubsplash(browser) {
  //open new page
  const page = await browser.newPage();
  //Navigate to Webpage
  await page.goto("https://dashboard.subsplash.com/auth/login");
  //Login to website
  await page.type("#email", "tcrain@metbiblechurch.ca");
  await page.type("#password", "Kallooer2");
  const [loginButton] = await page.$x("//button[contains(text(),'Log in')]");
  if (loginButton) {
    await loginButton.click();
  }

  const sidebarHandle = await page.waitForSelector('[app-id="22777"]');

  //Navigate to Library
  let libraryHandle = await page.evaluateHandle(
    (el) => el.shadowRoot.querySelector('[data-testid="dashboard-Library"]'),
    sidebarHandle
  );
  await libraryHandle.click();

  //Navigate to Lists
  let listsHandle = await page.evaluateHandle(
    (el) =>
      el.shadowRoot.querySelector('[data-testid="Library-dashboard-Lists"]'),
    sidebarHandle
  );
  await listsHandle.click();

  const mainHandle = await page.waitForSelector('[class="route-app__main"]');

  //Navigate to Listen
  await page.waitForTimeout(generalTimer);
  let listenHandle = await page.evaluateHandle(
    (el) => el.querySelector('[id="ember276"]'),
    mainHandle
  );
  await listenHandle.click();

  //Navigate to sermon series
  await page.waitForTimeout(generalTimer);
  let seriesButton = await page.evaluateHandle((el) => el.querySelectorAll(".kit-row-item__title")[1], mainHandle);
  await seriesButton.click();

  //Click the Create Media Item Button
  await page.waitForTimeout(generalTimer);
  await page.click("#ember1262");

  //Type Episode Title and confirm
  await page.waitForTimeout(generalTimer);
  await page.type("#ember1268",weeklyUploadsInformation[0].title);
  await page.waitForTimeout(generalTimer);
  let createButton = await page.evaluate((el) => el.querySelector("#ember1337").firstChild.lastElementChild.textContent, mainHandle);
  console.log(createButton)
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  //runAnchor(browser);
  runSubsplash(browser);
})();
