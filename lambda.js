const main = require('./main');

exports.handler = async (event, context) => {
  main(event.theaters, (res) => context.suceed(res), (err) => context.fail(err));
};
