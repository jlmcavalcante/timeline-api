module.exports = app => {
  const controller = app.controllers.caseTimelineController;

  app.route('/api/v1/timeline/screenshot').post(controller.generateScreenshot);
  app.route('/api/v1/timeline/clear-cache').delete(controller.clearCache);
}
