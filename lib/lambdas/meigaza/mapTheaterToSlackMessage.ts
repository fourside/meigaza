import { scraper } from "./scraper";
import { SlackMessage, Field } from "../shared/sendMessageToSlack";

// prettier-ignore
type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer U>) ? U :
    T;

type Theater = ThenArg<ReturnType<typeof scraper>>;

export function mapTheatersToSlackMessage(theater: Theater): SlackMessage {
  const attachment = theater.theater.map((theater) => {
    const message = {
      fallback: "films schedule (fallback message)",
      color: "#36a64f",
      pretext: "films schedule",
      title: theater.name,
      title_link: theater.url,
      fields: [] as Field[],
      ts: Math.floor(new Date().getTime() / 1000),
    };

    const today = theater.schedules.find((schedule) => {
      return schedule.date === "今日" || schedule.date === "明日";
    });
    if (!today) {
      message.fields = [
        {
          title: "today's schedule nothing",
          value: "",
          short: false,
        },
      ];
      return message;
    }
    message.fields = today.movies.map((movie) => {
      return {
        title: movie.title,
        value: movie.startAt.join(", "),
        short: false,
      };
    });
    return message;
  });
  return { attachments: attachment };
}
