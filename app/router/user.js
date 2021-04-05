/*
 * @Author: mikey.zhuozepng 
 * @Date: 2021-03-21 23:39:15 
 * @Last Modified by: mikey.zhuozepeng
 * @Last Modified time: 2021-04-05 20:41:44
 * 
 * @describe 关于用户模块路由
 */
module.exports = (router,controller) => {
    router.post('/user/myself', controller.user.myself);
    router.post('/user/createRole', controller.user.createRole);
    router.post('/user/updateMyself', controller.user.updateMyself);
};