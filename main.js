const scraper = require('./scraper');
const filter = require('./filter');
const sendMessage = require('./sendMessage');

const main = async (theaters, onSuccess, onError) => {
  try {
    const schedules = await scraper(theaters);
    const message = filter(schedules.theater);
    const res = await sendMessage(message);
    onSuccess(res.data);
  } catch (error) {
    onError(error);
  }
};

module.exports = main;
