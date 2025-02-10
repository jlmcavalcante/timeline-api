const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('config');
const consign = require('consign');

module.exports = () => {
  const app = express();

  // Setando variáveis da aplicação.
  app.set('port', process.env.PORT || config.get('server.port'));

  // Middlewares
  app.use(bodyParser.json());

  // Endpoints.
  consign({cwd: 'src'})
    .then('controllers')
    .then('routes')
    .into(app);

  return app;
};
