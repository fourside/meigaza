import { MvtkResponse } from "./scrapeMvtk";
import { isWithinThisWeek } from "./util";
import { IftttMessage } from "../shared/sendMessageToIfttt";

export function mapToIftttMessage(mvtkResponse: MvtkResponse): IftttMessage[] {
  const today = new Date();
  return mvtkResponse.mvtk
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
