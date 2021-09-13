import { MvtkResponse, Mvtk } from "./scrapeMvtk";
import { isWithinThisWeek } from "./util";
import { SlackMessage, Section } from "../shared/sendMessageToSlack";

export function mapToSlackMessage(mvtkResponse: MvtkResponse): SlackMessage {
  const today = new Date();
  const blocks = mvtkResponse.mvtk
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

function makeMovieSection(mvtk: Mvtk): Section {
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
