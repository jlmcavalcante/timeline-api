const app = require('./src/config/express')();
const port = app.get('port');
const { cleanOldCache } = require('./src/utils/cacheCleaner');

cleanOldCache();

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});
