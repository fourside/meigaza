import axios from "axios";
import { mapToIftttMessage } from "./mapToIftttMessage";

const IFTTT_WEBHOOK_URL = process.env.IFTTT_WEBHOOK_URL;

type Message = ReturnType<typeof mapToIftttMessage>;

export async function sendToIfttt(messages: Message) {
  if (messages.length === 0) {
    console.log("message is zero");
    return;
  }
  for (const message of messages) {
    try {
      const response = await axios({
        method: "post",
        url: IFTTT_WEBHOOK_URL,
        headers: {
          "Content-Type": "application/json",
        },
        data: message,
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
}
