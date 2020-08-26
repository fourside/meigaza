import * as chromium from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

export async function browserLauncher(): Promise<Browser> {
  const executablePath = await chromium.executablePath;
  if (executablePath) {
    const puppeteerCore = await import("puppeteer-core");
    return await puppeteerCore.launch({
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
