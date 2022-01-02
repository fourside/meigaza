import { ElementHandle } from "puppeteer-core";
import { browserLauncher, Browser, getTextFromElement } from "../shared/BrowserLauncher";
import { ScrapeError } from "../shared/scrapeError";

const MVTK_USER = process.env.MVTK_USER || "";
const MVTK_PASSWORD = process.env.MVTK_PASSWORD || "";

const LOGIN_URL = "https://mvtk.jp/Account/Login";

export type Mvtk = {
  date: string;
  title: string;
  link: string;
  img: string;
  description: string;
};

export type MvtkResponse = {
  mvtk: Mvtk[];
};

export async function scrapeMvtk(): Promise<MvtkResponse> {
  let browser: Browser | undefined;
  try {
    browser = await browserLauncher();

    const page = await browser.newPage();
    await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("input[name=email]");
    await page.type("[name=email]", MVTK_USER);
    await page.type("[name=password]", MVTK_PASSWORD);
    await page.click("button[type=submit]");
    await page.waitForSelector(".sortByDateRelease");

    const response: Mvtk[] = [];
    const lookList = await page.$$(".sortByDateRelease .look a.active");
    for (const look of lookList) {
      const item = (await page.evaluateHandle((el) => el.parentNode.parentNode, look)) as ElementHandle;

      const dateElm = await item.$(".date");
      const date = await getTextFromElement(dateElm);
      if (date === undefined) {
        throw new ScrapeError("mvtk", ".date");
      }

      const titleElm = await item.$(".ttl");
      const title = await getTextFromElement(titleElm);
      if (title === undefined) {
        throw new ScrapeError("mvtk", ".ttl");
      }

      const linkElm = await item.$(".ttl a");
      const link = await getTextFromElement(linkElm);
      if (link === undefined) {
        throw new ScrapeError("mvtk", ".ttl a");
      }

      const imgElm = await item.$(".image img");
      const img = await getTextFromElement(imgElm);
      if (img === undefined) {
        throw new ScrapeError("mvtk", ".image img");
      }

      const descriptionElm = await item.$(".description");
      const description = await getTextFromElement(descriptionElm);
      if (description === undefined) {
        throw new ScrapeError("mvtk", ".description");
      }

      response.push({ date, title, link, img, description });
    }

    return { mvtk: response };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
