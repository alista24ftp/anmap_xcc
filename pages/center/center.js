// pages/center/center.js
const { ApiHost } = require('../../config.js');
const { formatImg, successMsg, failMsg } = require('../../utils/util.js');
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.getStorage({
      key: 'settings',
      success: function (settings) {
        that.setData({
          centerImg: settings.data.centerImg
        });
      },
      fail: function (err) {
        failMsg('无法获取背景图');
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    getLoginData().then(loginData => {
      console.log(loginData);
      that.setData({
        isLoggedIn: true,
        userName: loginData.user.user_name,
        userPhone: loginData.user.user_tel,
        userPhoto: loginData.user.user_photo
      });
    }, err => {
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