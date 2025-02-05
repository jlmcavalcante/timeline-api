module.exports = () => {
  const caseMilestonesDB = require('../data/caseMilestones.json');
  const controller = {};

  controller.listCaseMilestones = (req, res) => res.status(200).json(caseMilestonesDB);

  return controller;
}