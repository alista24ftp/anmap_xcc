// pages/center/center.js
const { ApiHost } = require('../../config.js');
const { formatImg, successMsg, failMsg, getSettings } = require('../../utils/util.js');
const { getToken, getLoginData, goLogin, getUserInfoByToken } = require('../../utils/login.js');
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
    let that = this;
    getSettings().then(settings => {
      that.setData({
        centerImg: settings.centerImg
      });
    }, err => {
      failMsg('无法获取配置');
    });
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
    let that = this;
    getLoginData().then(loginData=>{
      getUserInfoByToken(loginData.loginToken).then(info=>{
        console.log(info);
        loginData.user.user_name = info.user_name;
        loginData.user.user_tel = info.user_tel;
        loginData.user.user_img = info.user_img;
        loginData.user.user_photo = formatImg(info.user_img);
        that.setData({
          isLoggedIn: true,
          userName: loginData.user.user_name,
          userPhone: loginData.user.user_tel,
          userPhoto: loginData.user.user_photo
        });
        wx.setStorage({
          key: 'userinfo',
          data: loginData,
          fail: function(err){
            failMsg('无法设置用户');
          }
        });
      }, err=>{
        console.error(err);
        failMsg(err);
      });
    }, err=>{
      goLogin();
    });
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