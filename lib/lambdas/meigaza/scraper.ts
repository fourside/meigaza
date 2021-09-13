import { Browser, getTextFromElement } from "../shared/BrowserLauncher";
import { browserLauncher } from "../shared/BrowserLauncher";

type Movie = {
  title: string;
  startAt: string[];
};

type Schedule = {
  date: string;
  movies: Movie[];
};

export type Theater = {
  name: string;
  url: string;
  schedules: Schedule[];
};

type ScraperResponse = {
  theater: Theater[];
};

export async function scraper(theaters: string[]): Promise<ScraperResponse> {
  let browser: Browser | undefined;
  try {
    browser = await browserLauncher();
    const responses = [];

    for (const theater of theaters) {
      const page = await browser.newPage();
      const url = `https://www.google.com/search?q=${encodeURIComponent(theater)}`;
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const response: Theater = {
        name: theater,
        url: url,
        schedules: [],
      };

      const dateList = await page.$$(".tb_tc li");
      if (dateList.length === 0) {
        console.log(`cannot scrape ${theater}`);
        continue;
      }
      for (const dateElm of dateList) {
        const dateText = await dateElm.getProperty("textContent");
        if (dateText === undefined) {
          continue;
        }
        const dateTextValue = await dateText.jsonValue<string>();
        await dateElm.click();

        const schedules = await page.$$(`[data-date="${dateTextValue}"] .lr_c_fcb.lr-s-stor`);
        const movies: Movie[] = [];
        for (const schedule of schedules) {
          const titleElement = await schedule.$(".lr_c_tmt");
          const title = await getTextFromElement(titleElement);
          if (title === undefined) {
            continue;
          }
          const startElementList = await schedule.$$(".lr_c_s .lr_c_stnl");
          const startList: string[] = [];
          for (const startElm of startElementList) {
            const startText = await startElm.getProperty("textContent");
            if (startText === undefined) {
              continue;
            }
            const startTextValue = await startText.jsonValue<string>();
            startList.push(startTextValue);
          }

          movies.push({
            title,
            startAt: startList,
          });
        }

        response.schedules.push({
          date: dateTextValue,
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
