import { theaters } from "./theaters";
import { scraper } from "./scraper";
import { mapTheatersToSlackMessage } from "./mapTheaterToSlackMessage";
import { sendMessageToSlack } from "../shared/sendMessageToSlack";
import { ScrapeError } from "../shared/scrapeError";

export async function handler(_event: unknown): Promise<void> {
  console.log(JSON.stringify(_event));
  try {
    const scrapeResult = await scraper(theaters);
    console.log("scraped:", scrapeResult);
    const slackMessage = mapTheatersToSlackMessage(scrapeResult.theater);
    const result = await sendMessageToSlack(slackMessage);
    console.log(result);
  } catch (e) {
    console.error(e);
    if (e instanceof ScrapeError) {
      // TODO send slack message
    }
  }
}
