import { scrapeMvtk } from "./scrapeMvtk";
import { mapToIftttMessage } from "./mapToIftttMessage";
import { mapToSlackMessage } from "./mapToSlackMessage";
import { sendMessageToIfttt } from "../shared/sendMessageToIfttt";
import { sendMessageToSlack } from "../shared/sendMessageToSlack";

export async function handler(_event: unknown): Promise<void> {
  try {
    const mvtks = await scrapeMvtk();
    const iftttMessage = mapToIftttMessage(mvtks);
    const slackMessage = mapToSlackMessage(mvtks);

    const results = await Promise.all([
      // prettier-ignore
      sendMessageToIfttt(iftttMessage),
      sendMessageToSlack(slackMessage),
    ]);
    console.log(results);
  } catch (e) {
    console.log(e);
  }
}
