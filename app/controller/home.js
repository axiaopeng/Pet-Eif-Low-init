'use strict';

const Controller = require('egg').Controller;
//post请求参数 ctx.request.body
//get请求参数 ctx.request.query
class HomeController extends Controller {
  async register() {
    let rst = {
      status: 200,
      success: true,
      message: ''
    }
    const {ctx} = this;
    ctx.logger.info('注册参数:',ctx.request.body)
    try{
      let user = await ctx.model.User.create({
        account: ctx.request.body.account,
        pwd: ctx.request.body.pwd,
        sign_up_time: new Date(),                 //创建时间
      })
      rst.status = 10004;
      rst.creds = user.account,
      rst.message = '注册成功!';
    }catch(err){
      if(err.errors&&err.errors[0].type === 'unique violation'){
        rst = {
          status: 20002,
          success: false,
          message: '该账号已存在！',
          err: err.errors[0].message
        }
      }
      ctx.logger.error('home.register error: ',JSON.stringify(err.errors));
    }
    ctx.body = rst;
  }
  async login() {
    let rst = {
      status: 200,
      success: true,
      message: ''
    }
    const {ctx} = this;
    ctx.logger.info('登录参数:',ctx.request.body)
    try{
      let user = await ctx.model.User.findByLogin(ctx.request.body)
      try {
        await user.signIn();
        rst.status = 10001;
        rst.creds = user.account;
        rst.lastRoleId = user.roleid;
        rst.roles = await user.getRoles();
        rst.message = '登录成功!';
      } catch (error) {
        rst = {
          status: 20001,
          success: false,
          message: '密码错误！',
        }
      }
    }catch(err){
      ctx.logger.error('home.login error:',err)
    }
    ctx.body = rst;
  }
}

module.exports = HomeController;
