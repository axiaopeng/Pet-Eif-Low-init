'use strict';

const Controller = require('egg').Controller;
//post请求参数 ctx.request.body
//get请求参数 ctx.request.query
class HomeController extends Controller {

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
        rst.creds = user.account,
        rst.message = '登录成功!';
      } catch (error) {
        rst = {
          status: 20001,
          success: false,
          message: '密码错误！',
        }
      }
    }catch(err){
      console.log(err)
    }
    ctx.body = rst;
  }
}

module.exports = HomeController;
