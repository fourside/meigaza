import axios, { AxiosResponse } from "axios";

export type SlackMessage = {
  attachments: Attachment[];
};

type Attachment = {
  fallback: string;
  color: string;
  pretext: string;
  title: string;
  title_link: string;
  fields: Field[];
  ts: number;
};

export type Field = {
  title: string;
  value: string;
  short: boolean;
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
