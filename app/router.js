'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.login);
  router.post('/login', controller.home.login);
  router.post('/register', controller.home.register);
  //用户模块路由
  require('./router/user')(router,controller);

};
