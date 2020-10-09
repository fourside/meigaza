import { scraper } from "./scraper";
import { SlackMessage, Blocks, Section, Divider } from "../shared/sendMessageToSlack";

// prettier-ignore
type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer U>) ? U :
    T;

type Theater = ThenArg<ReturnType<typeof scraper>>;

export function mapTheatersToSlackMessage(theater: Theater): SlackMessage {
  const blocks: Blocks = [];
  theater.theater.forEach((theater) => {
    const theaterNameSection = makeTheaterNameSection(theater.name, theater.url);
    blocks.push(theaterNameSection);

    const today = theater.schedules.find((schedule) => {
      return schedule.date === "今日" || schedule.date === "明日";
    });

    if (!today) {
      blocks.push(makeNoScheduleSection());
    } else {
      const movieSections = today.movies.map((movie) => {
        return makeMovieScheduleSection(movie.title, movie.startAt);
      });
      blocks.push(...movieSections);
    }
    blocks.push(makeDividerSection());
  });
  blocks.pop(); // remove last divider
  return { blocks };
}

function makeTheaterNameSection(name: string, url: string): Section {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*<${url}|${name}>*`,
    },
  };
}

function makeNoScheduleSection(): Section {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "today's schedule nothing",
    },
  };
}

function makeMovieScheduleSection(title: string, startAts: string[]): Section {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${title}*\n${startAts.join(",")}`,
    },
  };
}

function makeDividerSection(): Divider {
  return {
    type: "divider",
  };
}
