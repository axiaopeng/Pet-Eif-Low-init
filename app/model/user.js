
'use strict';
 
module.exports = app => {
  const { STRING, INTEGER, DATE,BIGINT } = app.Sequelize;
  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    account: STRING(30),
    pwd: STRING(30),
    last_sign_in_time: DATE,            //最后登录时间
    sign_up_time: DATE,                 //创建时间
    login_status: INTEGER,              //登录状态   0：未登录  1：已登陆
    roleid: BIGINT,                     //最后登录时选中的角色
  },{
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,
  });
  User.findByLogin = async function(login) {
    let user = await this.findOne({
      where: {
        account: login.account
      }
    });
    //验证密码
    if(user.pwd !== login.pwd){
      return 
    }
    return user
  }
  // 登录
  User.prototype.signIn = async function() {
    return await this.update({ 
      login_status: 1,                  //登录状态
      last_sign_in_time: new Date(),    //登录时间
    });
  }
  //获取全部角色
  User.prototype.getRoles = async function() {
    return await app.model.UserInfo.findAll({
      attributes: ['id','role_name','role_type'],
      where: {
        uid: this.id,
        status: 1,
      }
    })
  }
  User.associate = function(){
    app.model.User.hasMany(app.model.UserInfo, {foreignKey: 'uid'})
    app.model.UserInfo.belongsTo(app.model.User, {foreignKey: 'uid', targetKey: 'id'})
  }
  return User;

};