const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const LOGIN_USER = process.env.LOGIN_USER;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;

const mvtk = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      //executablePath: 'C:\\Program Files\ (x86)\\Google\\Chrome\\Application\\Chrome.exe',
      headless: chromium.headless,
    });

    let page = await browser.newPage();
    const url = 'https://mvtk.jp/Account/Login';
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.type("[name=email]", LOGIN_USER);
    await page.type("[name=password]", LOGIN_PASSWORD);
    await page.click("button[type=submit]");
    await page.waitForSelector(".sortByDateRelease");

    const response = [];
    const lookList = await page.$$('.sortByDateRelease .look a.active');
    for(let look of lookList) {
      const item = await page.evaluateHandle(el => el.parentNode.parentNode, look);

      const dateElm = await item.$('.date');
      const dateString = await (await dateElm.getProperty('textContent')).jsonValue();

      const titleElm = await item.$('.ttl');
      const title = await (await titleElm.getProperty('textContent')).jsonValue();

      const linkElm = await item.$('.ttl a');
      const link = await (await linkElm.getProperty('href')).jsonValue();

      const imgElm = await item.$('.image img');
      const img = await (await imgElm.getProperty('src')).jsonValue();

      const descriptionElm = await item.$('.description');
      const description = await (await descriptionElm.getProperty('textContent')).jsonValue();

      response.push({
        date: dateString,
        title: title,
        link: link,
        img: img,
        description: description,
      });
    }

    return { mvtk: response };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

module.exports = mvtk;

