const mvtk = require('./mvtk');
const filter = require('./filter');
const sendMessage = require('./sendMessage');

const main = async () => {
  const mvtks = await mvtk();
  const message = filter(mvtks.mvtk);
  const res = await sendMessage(message);
  return res.data;
};

module.exports = main;
