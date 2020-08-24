import { scraper } from "./scraper";
import { mapTheatersToSlackMessage } from "./mapTheaterToSlackMessage";
import { sendMessageToSlack } from "./sendMessageToSlack";

export async function handler(event: any) {
  try {
    const theater = await scraper(event);
    const slackMessage = mapTheatersToSlackMessage(theater);
    const result = await sendMessageToSlack(slackMessage);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
