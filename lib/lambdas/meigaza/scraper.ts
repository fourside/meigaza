import { Browser } from "puppeteer-core";
import { browserLauncher } from "../shared/BrowserLauncher";

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
    browser = await browserLauncher();
    const responses = [];

    for (const theater of theaters) {
      const page = await browser.newPage();
      const url = `https://www.google.com/search?q=${encodeURIComponent(theater)}`;
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const response = {
        name: theater,
        url: url,
        schedules: [] as Schedule[],
      };

      const dateList = await page.$$(".tb_tc li");
      if (dateList.length === 0) {
        console.log(`cannot scrape ${theater}`);
        continue;
      }
      for (const dateElm of dateList) {
        const dateText = await (await dateElm.getProperty("textContent")).jsonValue();
        await dateElm.click();

        const schedules = await page.$$(`[data-date="${dateText}"] .lr_c_fcb.lr-s-stor`);
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
            startList.push(startText);
          }

          movies.push({
            title: title as string,
            startAt: startList as string[],
          });
        }

        response.schedules.push({
          date: dateText as string,
          movies: movies,
        });
      }
      responses.push(response);
    }
    return { theater: responses };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
