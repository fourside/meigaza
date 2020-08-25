import axios from "axios";
import { mapToSlackMessage } from "./mapToSlackMessage";

const INCOMING_WEBHOOK_URL = process.env.SLACK_INCOMING_WEBHOOK_URL;

type Message = ReturnType<typeof mapToSlackMessage>;

export async function sendToSlack(message: Message) {
  const response = await axios({
    method: "post",
    url: INCOMING_WEBHOOK_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: message,
  });
  return response;
}
