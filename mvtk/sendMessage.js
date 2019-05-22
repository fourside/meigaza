const axios = require("axios");

const INCOMING_WEBHOOK_URL = process.env.INCOMING_WEBHOOK_URL;

const sendMessage = async (message) => {
  const response = await axios({
    method: "post",
    url: INCOMING_WEBHOOK_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: message,
  });
  return response;
};

module.exports = sendMessage;

