import { Browser, getTextFromElement } from "../shared/BrowserLauncher";
import { browserLauncher } from "../shared/BrowserLauncher";
import { ScrapeError } from "../shared/scrapeError";

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

export async function scraper(theaterNames: string[]): Promise<ScraperResponse> {
  let browser: Browser | undefined;
  try {
    browser = await browserLauncher();
    const theaters: Theater[] = [];

    for (const theaterName of theaterNames) {
      try {
        const theater = await scrapeTheater(browser, theaterName);
        theaters.push(theater);
      } catch (error) {
        console.error(`Failed to scrape ${theaterName}`, error);
      }
    }
    return { theater: theaters };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function scrapeTheater(browser: Browser, theaterName: string): Promise<Theater> {
  const page = await browser.newPage();
  const url = `https://www.google.com/search?q=${encodeURIComponent(theaterName)}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const theater: Theater = {
    name: theaterName,
    url: url,
    schedules: [],
  };

  const dateList = await page.$$(".tb_tc li");
  if (dateList.length === 0) {
    throw new ScrapeError(theaterName, ".tb_tc li");
  }
  for (const dateElm of dateList) {
    const dateText = await dateElm.getProperty("textContent");
    if (dateText === undefined) {
      throw new ScrapeError(theaterName);
    }
    const dateTextValue = await dateText.jsonValue<string>();
    await dateElm.click();

    const schedules = await page.$$(`[data-date="${dateTextValue}"] .lr_c_fcb.lr-s-stor`);
    const movies: Movie[] = [];
    for (const schedule of schedules) {
      const titleElement = await schedule.$(".lr_c_tmt");
      const title = await getTextFromElement(titleElement);
      if (title === undefined) {
        throw new ScrapeError(theaterName, ".lr_c_tmt");
      }
      const startElementList = await schedule.$$(".lr_c_s .lr_c_stnl");
      const startList: string[] = [];
      for (const startElm of startElementList) {
        const startText = await startElm.getProperty("textContent");
        if (startText === undefined) {
          throw new ScrapeError(theaterName, ".lr_c_s .lr_c_stnl");
        }
        const startTextValue = await startText.jsonValue<string>();
        startList.push(startTextValue);
      }

      movies.push({
        title,
        startAt: startList,
      });
    }
  }
  return theater;
}
