import axios, { AxiosResponse } from "axios";

export type SlackMessage = {
  blocks: Blocks;
};

export type Blocks = (Section | Divider)[];
export type Section = {
  type: "section";
  text: {
    type: "mrkdwn";
    text: string;
  };
  accessory?: Accessory;
};
type Accessory = {
  type: "image";
  image_url: string;
  alt_text: string;
};
export type Divider = {
  type: "divider";
};

const INCOMING_WEBHOOK_URL = process.env.SLACK_INCOMING_WEBHOOK_URL;

export async function sendMessageToSlack(message: SlackMessage): Promise<AxiosResponse> {
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
