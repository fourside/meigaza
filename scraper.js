const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const scraper = async (theaters) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      //executablePath: 'C:\\Program Files\ (x86)\\Google\\Chrome\\Application\\Chrome.exe',
      headless: chromium.headless,
    });

    const responses = [];

    for(let theater of theaters) {

      let page = await browser.newPage();
      const url = 'https://www.google.com/search?q=' + encodeURIComponent(theater);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const response = {
        name: theater,
        url: url,
        schedules: []
      };

      let dateList = await page.$$('.tb_tc li');
      for (let dateElm of dateList) {
        const dateText = await (await dateElm.getProperty('textContent')).jsonValue();
        await dateElm.click();

        const schedules = await page.$$(`[data-date="${dateText}"] .lr_c_fcb.lr-s-stor`)
        const movies = [];
        for (let schedule of schedules) {
          const titleElement = await schedule.$('.lr_c_tmt');
          const title = await (await titleElement.getProperty('textContent')).jsonValue();
          const startElementList = await schedule.$$('.lr_c_s .lr_c_stnl');
          const startList = [];
          for (let startElm of startElementList) {
            const startText = await (await startElm.getProperty('textContent')).jsonValue();
            startList.push(startText)
          }

          movies.push({
            title: title,
            startAt: startList
          });
        }

        response.schedules.push({
          date: dateText,
          movies: movies
        });
      }
      responses.push(response);
    }
    return {theater: responses};
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

module.exports = scraper;
