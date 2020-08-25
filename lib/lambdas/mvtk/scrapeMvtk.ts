import * as chromium from "chrome-aws-lambda";
import { launch, Browser, ElementHandle } from "puppeteer-core";

// prettier-ignore
type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer U>) ? U :
    T;

export type Mvtk = ThenArg<ReturnType<typeof scrapeMvtk>>;

const MVTK_USER = process.env.MVTK_USER || "";
const MVTK_PASSWORD = process.env.MVTK_PASSWORD || "";

const LOGIN_URL = "https://mvtk.jp/Account/Login";

export async function scrapeMvtk() {
  let browser: Browser | undefined;
  try {
    browser = await launchBrowser();

    const page = await browser.newPage();
    await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("input[name=email]");
    await page.type("[name=email]", MVTK_USER);
    await page.type("[name=password]", MVTK_PASSWORD);
    await page.click("button[type=submit]");
    await page.waitForSelector(".sortByDateRelease");

    const response = [];
    const lookList = await page.$$(".sortByDateRelease .look a.active");
    for (const look of lookList) {
      const item = (await page.evaluateHandle((el) => el.parentNode.parentNode, look)) as ElementHandle;

      const dateElm = await item.$(".date");
      if (!dateElm) continue;
      const dateString = await (await dateElm.getProperty("textContent")).jsonValue();

      const titleElm = await item.$(".ttl");
      if (!titleElm) continue;
      const title = await (await titleElm.getProperty("textContent")).jsonValue();

      const linkElm = await item.$(".ttl a");
      if (!linkElm) continue;
      const link = await (await linkElm.getProperty("href")).jsonValue();

      const imgElm = await item.$(".image img");
      if (!imgElm) continue;
      const img = await (await imgElm.getProperty("src")).jsonValue();

      const descriptionElm = await item.$(".description");
      if (!descriptionElm) continue;
      const description = await (await descriptionElm.getProperty("textContent")).jsonValue();

      response.push({
        date: dateString as string,
        title: title as string,
        link: link as string,
        img: img as string,
        description: description as string,
      });
    }

    return { mvtk: response };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function launchBrowser() {
  const executablePath = await chromium.executablePath;
  if (executablePath) {
    return await launch({
      args: chromium.args,
      product: "chrome",
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });
  }
  const puppeteer = await import("puppeteer");
  return await puppeteer.launch();
}
