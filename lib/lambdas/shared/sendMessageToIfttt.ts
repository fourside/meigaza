import axios from "axios";

const IFTTT_WEBHOOK_URL = process.env.IFTTT_WEBHOOK_URL;

export type IftttMessage = {
  value1: string;
  value2: string;
  value3: string;
};

export async function sendMessageToIfttt(messages: IftttMessage[]): Promise<void> {
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
