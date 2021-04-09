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
      await ctx.model.User.update({
        roleid: ctx.request.body.roleId
      },{
        where: {
          account: ctx.request.body.userCreds,
        },
      })
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
          role_type: role.user_infos[0].role_type,
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
  //创建角色
  async createRole() {
    let rst = {
      status: 200,
      success: true,
      message: ''
    }
    const {ctx} = this;
    ctx.logger.info('请求参数:',ctx.request.body)
    try{
      let user = await ctx.model.User.findOne({
        where: {
          account: ctx.request.body.creds,
        }
      })
      let role = await ctx.model.UserInfo.create({
        uid: user.id,
        status: 1,
        role_name: ctx.request.body.roleName,
        position_x: 0,
        position_y: 0,
        role_type: ctx.request.body.type,
      })
        rst.status = 10005;
        rst.data = role;
    }catch(err){
      if(err.errors[0].type === 'unique violation'){
        rst = {
          status: 20003,
          success: false,
          message: '该角色名称已存在！',
          err: err.errors[0].message
        }
      }
      ctx.logger.error('user.createRole error: ',JSON.stringify(err.errors));
 
    }
    ctx.body = rst;
  }
}

module.exports = HomeController;
