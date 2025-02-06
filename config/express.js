const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('config');

module.exports = () => {
  const app = express();

  // Setando variáveis da aplicação.
  app.set('port', process.env.PORT || config.get('server.port'));

  // Middlewares: são funções intermediárias em uma aplicação que interceptam as requisições antes que elas cheguem aos endpoints finais.
  app.use(bodyParser.json());

  require('../api/routes/caseTimeline')(app);

  return app;
};
