import { scraper } from "./scraper";

type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer U>) ? U :
    T;

type Theater = ThenArg<ReturnType<typeof scraper>>;

type SlackMessageFields = {
  title: string;
  value: string;
  short: boolean;
};

export function mapTheatersToSlackMessage(theater: Theater) {
  const attachment = theater.theater.map(theater => {
    const message = {
      fallback: "films schedule (fallback message)",
      color: "#36a64f",
      pretext: "films schedule",
      title: theater.name,
      title_link: theater.url,
      fields: [] as SlackMessageFields[],
      ts: Math.floor(new Date().getTime() / 1000),
    };

    const today = theater.schedules.find(schedule => {
      return schedule.date === "今日" || schedule.date === "明日";
    });
    if (!today) {
      throw new Error("today's schedule is nothing");
    }
    message.fields = today.movies.map(movie => {
      return {
        "title": movie.title,
        "value": movie.startAt.join(", "),
        "short": false
      };
    });
    return message;
  });
  return { attachments: attachment };
};
