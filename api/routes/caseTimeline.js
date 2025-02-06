module.exports = app => {
  const controller = app.controllers.caseTimeline;

  app.route('/api/v1/case-milestones/list').get(controller.listCaseMilestones);
  app.route('/api/v1/case-milestones/screenshot').post(controller.generateScreenshot);
}
