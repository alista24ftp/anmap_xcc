const {ApiHost} = require('../config.js');
const {formatImg, failMsg} = require('./util.js');

const getToken = () => {
  return new Promise(function (resolve, reject) {
    wx.getStorage({
      key: 'userinfo',
      success: function (data) {
        resolve(data.data.loginToken);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
};

const getUserInfo = () => {
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
};

const getUserInfoByToken = (token) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: ApiHost + '/xcc/Login/getInfo',
      data: { token },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          if (res.data.type == 1) {
            resolve(res.data.data);
          } else {
            reject('没有用户信息');
          }
        } else {
          reject('获取用户异常');
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
};

const getLoginData = () => {
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
};

const setLoginData = (loginData) => {
  //const that = this;
  return new Promise(function (resolve, reject) {
    getUserInfoByToken(loginData.loginToken).then(info => {
      console.log(info);
      loginData.user.user_name = info.user_name;
      loginData.user.user_tel = info.user_tel;
      loginData.user.user_img = info.user_img;
      loginData.user.user_photo = formatImg(info.user_img);
      loginData.user.is_boos = info.is_boos;
      loginData.user.user_id = info.user_id;
      wx.setStorage({
        key: 'userinfo',
        data: loginData,
        success: function (res) {
          resolve(loginData);
        },
        fail: function (err) {
          reject('无法设置用户');
        }
      });
    }, err => {
      reject('获取用户错误');
    });
  });
};

const goLogin = () => {
  wx.clearStorage({
    complete: function () {
      wx.navigateTo({
        url: '/pages/login/login',
        success: function (res) {
          failMsg('请先登录');
        }
      });
    }
  });

};

module.exports = {
  getToken,
  getUserInfo,
  getUserInfoByToken,
  getLoginData,
  setLoginData,
  goLogin
};