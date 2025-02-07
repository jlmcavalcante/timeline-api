module.exports = app => {
  const controller = app.controllers.caseTimeline;

  app.route('/api/v1/timeline/screenshot').post(controller.generateScreenshot);
}
