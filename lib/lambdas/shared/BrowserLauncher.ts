import chromium from "chrome-aws-lambda";
import { Browser as PuppeteerCoreBrowser, ElementHandle } from "puppeteer-core";
export type Browser = PuppeteerCoreBrowser;

export async function browserLauncher(): Promise<Browser> {
  const path = await chromium.executablePath;
  return await chromium.puppeteer.launch({
    args: chromium.args,
    product: "chrome",
    defaultViewport: chromium.defaultViewport,
    executablePath: path,
    headless: chromium.headless,
  });
}

export async function getTextFromElement(element: ElementHandle<Element> | null): Promise<string | undefined> {
  if (element === null) {
    return undefined;
  }
  const textContent = await element.getProperty("textContent");
  if (textContent === undefined) {
    return undefined;
  }
  return await textContent.jsonValue<string>();
}
