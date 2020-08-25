import { scrapeMvtk } from "./scrapeMvtk";
import { mapToIftttMessage } from "./mapToIftttMessage";
import { mapToSlackMessage } from "./mapToSlackMessage";
import { sendToIfttt } from "./sendToIfttt";
import { sendToSlack } from "./sendToSlack";

export async function handler(event: any) {
  try {
    const mvtks = await scrapeMvtk();
    const iftttMessage = mapToIftttMessage(mvtks);
    const slackMessage = mapToSlackMessage(mvtks);

    const results = await Promise.all([
      // prettier-ignore
      sendToIfttt(iftttMessage),
      sendToSlack(slackMessage),
    ]);
    console.log(results);
  } catch (e) {
    console.log(e);
  }
}
