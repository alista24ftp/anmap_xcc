// pages/center/center.js
const {ApiHost} = require('../../config.js');
const {getLoginData, goLogin} = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loggedIn: false,
    user: null
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    getLoginData().then(loginData=>{
      console.log()
      let loginToken = loginData.loginToken;
      let userInfo = loginData.user;
      console.log(loginToken);
      console.log(userInfo);
      if (!loginToken || !userInfo) {
        that.setData({
          loggedIn: false,
          user: null
        });
      } else {
        that.setData({
          loggedIn: true,
          user: userInfo
        });
      }
    }, err=>{

      wx.redirectTo({
        url: '/pages/login/login'
      })
      //goLogin();
    
    });
    console.log('1');
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