import { theaters } from "./theaters";
import { scraper } from "./scraper";
import { mapTheatersToSlackMessage } from "./mapTheaterToSlackMessage";
import { sendMessageToSlack } from "../shared/sendMessageToSlack";

export async function handler(_event: unknown): Promise<void> {
  console.log(JSON.stringify(_event));
  try {
    const response = await scraper(theaters);
    const slackMessage = mapTheatersToSlackMessage(response.theater);
    const result = await sendMessageToSlack(slackMessage);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
