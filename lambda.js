const main = require('./main');

exports.handler = async (event, context) => {
  await main(event.theaters, (res) => context.suceed(res), (err) => context.fail(err));
};
