import { Mvtk } from "./scrapeMvtk";
import { isWithinThisWeek } from "./util";
import { IftttMessage } from "../shared/sendMessageToIfttt";

export function mapToIftttMessage(mvtks: Mvtk): IftttMessage[] {
  const today = new Date();
  return mvtks.mvtk
    .filter((mvtk) => {
      return isWithinThisWeek(mvtk.date, today);
    })
    .map((mvtk) => {
      return {
        value1: `${mvtk.title}-${mvtk.date}`,
        value2: mvtk.link,
        value3: mvtk.img,
      };
    });
}
