import { Mvtk } from "./scrapeMvtk";
import { isWithinThisWeek } from "./util";
import { SlackMessage } from "../shared/sendMessageToSlack";

export function mapToSlackMessage(mvtks: Mvtk): SlackMessage {
  const today = new Date();
  const attachment = mvtks.mvtk
    .filter((mvtk) => {
      return isWithinThisWeek(mvtk.date, today);
    })
    .map((mvtk) => {
      return {
        fallback: "mvtk (fallback message)",
        color: "#36a64f",
        pretext: "mvtk: watch list",
        title: mvtk.title,
        title_link: mvtk.link,
        fields: [
          {
            title: mvtk.date,
            value: mvtk.description,
            short: false,
          },
        ],
        ts: Math.floor(new Date().getTime() / 1000),
      };
    });
  return { attachments: attachment };
}
