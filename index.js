const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const util = require('util');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      //executablePath: await chromium.executablePath,
      executablePath: 'C:\\Program Files\ (x86)\\Google\\Chrome\\Application\\Chrome.exe',
      headless: chromium.headless,
    });

    const theaters = [
      "新文芸坐",
      "ギンレイホール",
      "目黒シネマ", 
      "早稲田松竹",
    ];

    const responses = [];

    for(let theater of theaters) {

      const response = {
        name: theater,
        schedules: []
      };

      let page = await browser.newPage();
      await page.goto('https://www.google.com/search?q=' + encodeURIComponent(theater), { waitUntil: "domcontentloaded" });

      let dateList = await page.$$('.tb_tc li');
      for (let dateElm of dateList) {
        const dateText = await (await dateElm.getProperty('textContent')).jsonValue();
        await dateElm.click();
        const schedules = await page.$$(`[data-date="${dateText}"] .lr_c_fcb.lr-s-stor`)
        const movies = [];
        for (let schedule of schedules) {
          const titleElement = await schedule.$('.lr_c_tmt');
          const title = await (await titleElement.getProperty('textContent')).jsonValue();
          const startElementList = await schedule.$$('.lr_c_s div');
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
    console.log(util.inspect({theater: responses}, {colors: true, depth: null}))
  } catch (error) {
    console.log(error)
    return;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
})();

