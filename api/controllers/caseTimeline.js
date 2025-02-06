module.exports = () => {
  const caseMilestonesDB = require('../data/caseMilestones.json');

  // Objeto que servirá como container para as funções que serão expostas para manipulação das rotas.
  const controller = {};

  controller.listCaseMilestones = (req, res) => res.status(200).json(caseMilestonesDB);

  return controller;
}