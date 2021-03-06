// pages/member/login/login.js
const {ApiHost} = require('../../config.js');
const {formatImg, successMsg, failMsg} = require('../../utils/util.js');
const { getLoginData, goLogin } = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindGetUserInfo(e) {
    var data = e.detail
    let that = this;
    if (data.iv && data.encryptedData) {
      wx.login({
        success(res) {
          if (res.code) {
            // 发起网络请求
            wx.request({
              url: ApiHost + '/xcc/Login/index',
              method: 'POST',
              data: {
                code: res.code,
                iv: data.iv,
                encryptedData: data.encryptedData
              },
              success: function (res) {
                console.log(res);
                if (res.data.code == 200) {
                  if (res.data.type == 1) {
                    // 已注册
                    let loginToken = res.data.data;
                    let userInfo = res.data.user;
                    userInfo.user_photo = formatImg(userInfo.user_img);
                    wx.setStorage({
                      key: 'userinfo',
                      data: {
                        loginToken: loginToken,
                        user: userInfo
                      },
                      success: function (res) {
                        wx.navigateBack({
                          delta: 1,
                          success: function(res){
                            successMsg('登录成功');
                          }
                        });
                      }
                    });
                  } else {
                    console.log(res.data);
                    console.log('res');
                    // 未注册
                    if(res.data.openId && res.data.unionid){
                      wx.navigateTo({
                        url: '/pages/register/register?id=' + res.data.openId + '&user_name=' + res.data.user_name + '&unionid=' + res.data.unionid + '&userimg=' + res.data.user_img,//userImg,
                        fail: function (err) {
                          console.error(err);
                          failMsg('信息获取失败');
                        }
                      });
                    }else{
                      failMsg('信息获取失败');
                    }
                    
                  }
                } else {
                  console.error('登录状态异常');
                  failMsg('登录状态异常');
                }
              }
            })
            console.log(res);
          } else {
            console.log('登录失败！' + res.errMsg);
            failMsg('登录失败');
          }
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})