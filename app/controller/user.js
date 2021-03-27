'use strict';

const Controller = require('egg').Controller;
//post请求参数 ctx.request.body
//get请求参数 ctx.request.query
class HomeController extends Controller {
  //获取当前用户自身数据
  async myself() {
    let rst = {
      status: 200,
      success: true,
      message: ''
    }
    const {ctx} = this;
    ctx.logger.info('请求参数:',ctx.request.body)
    try{
      let role = await ctx.model.User.findOne({
        where: {
          account: ctx.request.body.userCreds,
        },
        include:[{
          model: ctx.app.model.UserInfo,
          where: {
            col1: ctx.app.Sequelize.where(ctx.app.Sequelize.col('user.roleid'),'=',ctx.app.Sequelize.col('user_infos.id'))
          }, //这里需要确保查询关联到的只有一个角色信息
        }],
        attributes: ['id','account','roleid'],
      })
      if(role){
        rst.status = 10002;
        rst.data = { 
          name: role.user_infos[0].role_name,
          positionX: role.user_infos[0].position_x,
          positionY: role.user_infos[0].position_y,
        }
      }
    }catch(err){
      console.log(err)
    }
    ctx.body = rst;
  }
  //更新当前用户自身数据
  async updateMyself() {
    let rst = {
      status: 200,
      success: true,
      message: ''
    }
    const {ctx} = this;
    ctx.logger.info('请求参数:',ctx.request.body)
    try{
      let role = await ctx.model.UserInfo.update({
        position_x: ctx.request.body.positionX,
        position_y: ctx.request.body.positionY,
      },{
        include:[{
          model: ctx.app.model.User,
          where: {
            account: ctx.request.body.userCreds, // 查询字段待修改，先用account
          }, //这里需要确保查询关联到的只有一个角色信息
        }],
        where: {
          id: ctx.request.body.roleId,
        }
      })
      //退出
      await ctx.model.User.update({
        login_status: 0,
      },{
        where: {
          account: ctx.request.body.userCreds, // 查询字段待修改，先用account
        }
      })
      rst.status = 10003;
      rst.data = role
    }catch(err){
      console.log(err)
    }
    ctx.body = rst;
  }
}

module.exports = HomeController;
