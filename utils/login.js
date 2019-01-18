const {ApiHost} = require('../config.js');
const {failMsg} = require('./util.js');
module.exports = {
  getToken: function(){
    return new Promise(function(resolve, reject){
      wx.getStorage({
        key: 'userinfo',
        success: function(data){
          resolve(data.data.loginToken);
        },
        fail: function(err){
          reject(err);
        }
      })
    });
  },

  getUserInfo: function(){
    return new Promise(function (resolve, reject) {
      wx.getStorage({
        key: 'userinfo',
        success: function (data) {
          resolve(data.data.user);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
  },

  getUserInfoByToken: function(token){
    return new Promise(function(resolve, reject){
      wx.request({
        url: ApiHost + '/xcc/Login/getInfo',
        data: {token},
        method: 'POST',
        success: function(res){
          if(res.data.code == 200){
            if(res.data.type == 1){
              resolve(res.data.data);
            }else{
              reject('没有用户信息');
            }
          }else{
            reject('获取用户异常');
          }
        },
        fail: function(err){
          reject(err);
        }
      });
    });
  },

  getLoginData: function(){
    return new Promise(function (resolve, reject) {
      wx.getStorage({
        key: 'userinfo',
        success: function (data) {
          resolve(data.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
  },

  goLogin: () => {
    wx.navigateTo({
      url: '/pages/login/login',
      success: function (res) {
        failMsg('请先登录');
      }
    });
  }
  
};