const https = require("https");

const API_GATEWAY_API_KEY = process.env.API_GATEWAY_API_KEY;
const API_GATEWAY_ENDPOINT = process.env.API_GATEWAY_ENDPOINT;
const SLACK_INCOMING_WEBHOOK_ENDPOINT = process.env.SLACK_INCOMING_WEBHOOK_ENDPOINT;

// GET api gateway
const getSchedules = (makeMessageCallback) => {
  https.get({
    host: API_GATEWAY_ENDPOINT,
    port: 443,
    path: "/dev/meigaza",
    headers: {
      "x-api-key": API_GATEWAY_API_KEY,
    },
  }, (res) => {
    let rawData = '';
    res.on("data", (chunk) => {
      rawData += chunk;
    })
    res.on("end", () => {
      const data = JSON.parse(rawData);
      makeMessageCallback(data);
    })
  });
};

// make message format
const makeMessageFormat = (schedules) => {
  console.log(schedules)
};

// POST webhook
const postSlackMessage = (messageFormat) => {
};


getSchedules(makeMessageFormat);
//const messageFormat = makeMessageFormat(schedules);
//postSlackMessage(messageFormat);
