import { theaters } from "./theaters";
import { scraper } from "./scraper";
import { mapTheatersToSlackMessage } from "./mapTheaterToSlackMessage";
import { sendMessageToSlack } from "../shared/sendMessageToSlack";

export async function handler(event: any): Promise<void> {
  console.log(JSON.stringify(event));
  try {
    const theater = await scraper(theaters);
    const slackMessage = mapTheatersToSlackMessage(theater);
    const result = await sendMessageToSlack(slackMessage);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
