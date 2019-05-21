const axios = require("axios");
const util = require('util');

const API_GATEWAY_API_KEY = process.env.API_GATEWAY_API_KEY;
const API_GATEWAY_ENDPOINT = process.env.API_GATEWAY_ENDPOINT;
const SLACK_INCOMING_WEBHOOK_ENDPOINT = process.env.SLACK_INCOMING_WEBHOOK_ENDPOINT;

// GET api gateway
const getSchedules = async () => {
  const response = await axios.get(API_GATEWAY_ENDPOINT, {
    headers: {
      "x-api-key": API_GATEWAY_API_KEY,
    },
    timeout: 60 * 1000,
  });
  inspectlog(response.data);
  return response.data;
}

// make message format
const makeMessageFormat = (schedules) => {
};

// POST webhook
const postSlackMessage = (messageFormat) => {
};


const schedules = getSchedules();
const messageFormat = makeMessageFormat(schedules);
//postSlackMessage(messageFormat);

const inspectlog = (obj) => {
  console.log(util.inspect(obj, {colors: true, depth: null}))
}
