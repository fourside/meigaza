
const filter = (schedules) => {
  const attachment = schedules.map(theater => {
    const message = {
      fallback: "films schedule (fallback message)",
      color: "#36a64f",
      pretext: "films schedule",
      title: theater.name,
      title_link: theater.url,
      fields: [],
      ts: Math.floor(new Date().getTime() / 1000),
    };

    const today = theater.schedules.find(schedule => {
      return schedule.date === '今日' || schedule.date === '明日';
    });
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

module.exports = filter;
