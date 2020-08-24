import * as chromium from "chrome-aws-lambda";
import { launch, Browser } from "puppeteer-core";

type Movie = {
  title: string;
  startAt: string[];
};

type Schedule = {
  date: string;
  movies: Movie[];
};

export async function scraper(theaters: string[]) {
  let browser: Browser | undefined;
  try {
    browser = await launchBrowser();
    const responses = [];

    for(const theater of theaters) {

      const page = await browser.newPage();
      const url = `https://www.google.com/search?q=${encodeURIComponent(theater)}`;
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const response = {
        name: theater,
        url: url,
        schedules: [] as Schedule[],
      };

      const dateList = await page.$$(".tb_tc li");
      for (const dateElm of dateList) {
        const dateText = await (await dateElm.getProperty("textContent")).jsonValue();
        await dateElm.click();

        const schedules = await page.$$(`[data-date="${dateText}"] .lr_c_fcb.lr-s-stor`)
        const movies: Movie[] = [];
        for (const schedule of schedules) {
          const titleElement = await schedule.$(".lr_c_tmt");
          if (!titleElement) {
            continue;
          }
          const title = await (await titleElement.getProperty("textContent")).jsonValue();
          const startElementList = await schedule.$$(".lr_c_s .lr_c_stnl");
          const startList = [];
          for (const startElm of startElementList) {
            const startText = await (await startElm.getProperty("textContent")).jsonValue();
            startList.push(startText)
          }

          movies.push({
            title: title as string,
            startAt: startList as string[],
          });
        }

        response.schedules.push({
          date: dateText as string,
          movies: movies
        });
      }
      responses.push(response);
    }
    return {theater: responses};
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

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
