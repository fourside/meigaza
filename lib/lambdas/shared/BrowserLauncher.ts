import { executablePath, puppeteer, args, defaultViewport, headless } from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";

export async function browserLauncher(): Promise<Browser> {
  const path = await executablePath;
  if (path) {
    return await puppeteer.launch({
      args: args,
      product: "chrome",
      defaultViewport: defaultViewport,
      executablePath: path,
      headless: headless,
    });
  }
  const p = await import("puppeteer");
  return await p.launch();
}
