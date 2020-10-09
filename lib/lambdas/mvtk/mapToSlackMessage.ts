import { Mvtk } from "./scrapeMvtk";
import { isWithinThisWeek } from "./util";
import { SlackMessage, Section } from "../shared/sendMessageToSlack";

type mvtk = Mvtk["mvtk"] extends Array<infer T> ? T : never;

export function mapToSlackMessage(mvtks: Mvtk): SlackMessage {
  const today = new Date();
  const blocks = mvtks.mvtk
    .filter((mvtk) => {
      return isWithinThisWeek(mvtk.date, today);
    })
    .map((mvtk) => {
      return [makeMovieSection(mvtk), { type: "divider" as const }];
    })
    .flat();
  blocks.pop(); // remove last divider
  return { blocks };
}

function makeMovieSection(mvtk: mvtk): Section {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<${mvtk.link}|${mvtk.title}>*\n*${mvtk.date}*\n${mvtk.description}`,
    },
    accessory: {
      type: "image",
      image_url: mvtk.img,
      alt_text: mvtk.description,
    },
  };
}
