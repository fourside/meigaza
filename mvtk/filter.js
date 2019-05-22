const filter = (mvtks) => {
  const attachment = mvtks.map(mvtk => {
    const message = {
      fallback: "mvtk (fallback message)",
      color: "#36a64f",
      pretext: "mvtk: watch list",
      title: mvtk.title,
      title_link: mvtk.link,
      fields: [
        {
          "title": mvtk.date,
          "value": mvtk.description,
          "short": false
        }
      ],
      ts: Math.floor(new Date().getTime() / 1000),
    };

    return message;
  });
  return { attachments: attachment };
};

module.exports = filter;
