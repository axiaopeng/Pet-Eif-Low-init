
'use strict';
 
module.exports = app => {
  const { STRING, INTEGER, DATE,BIGINT } = app.Sequelize;
  const UserInfo = app.model.define('user_info', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    uid: INTEGER,             //外键 user表id
    status: INTEGER,          //角色状态  0：已删除 1：正常
    role_name: STRING(8),     //角色名称
    position_x: BIGINT,       //角色x轴坐标
    position_y: BIGINT,       //角色y轴坐标
    role_type: INTEGER,       //角色类型
    socketid: INTEGER,       //角色类型
  },{
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,
  });
  return UserInfo;

};