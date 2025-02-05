module.exports = app => {
  const controller = require('../controllers/caseTimeline')();

  app.route('/api/v1/case-milestones').get(controller.listCaseMilestones);
}