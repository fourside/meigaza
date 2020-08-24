import axios from "axios";
import { mapTheatersToSlackMessage } from "./mapTheaterToSlackMessage";

type Message = ReturnType<typeof mapTheatersToSlackMessage>;

const INCOMING_WEBHOOK_URL = process.env.INCOMING_WEBHOOK_URL;

export async function sendMessageToSlack(message: Message) {
  const response = await axios({
    method: "post",
    url: INCOMING_WEBHOOK_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: message,
  });
  return response;
};
