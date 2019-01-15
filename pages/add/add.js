// pages/add/add.js
const {formatDate, formatTime} = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [
      '请选择类型',
      '旅游',
      '学习',
      '出差',
      '讲课'
    ],
    catIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let todayFullDate = new Date(Date.now());
    let todayDate = formatDate(todayFullDate);
    let todayTime = formatTime(todayFullDate);

    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          },
          locAddr: res.address !== undefined ? res.address : false,
          locName: res.name !== undefined ? res.name : false,
          wd: res.latitude,
          jd: res.longitude,
          selectedDate: todayDate,
          selectedTime: todayTime
        })
      },
      fail: function (err) {
        // fail
        console.error('取消选择位置');
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    })
  },

  selectDate: function(e){
    this.setData({selectedDate: e.detail.value});
  },

  selectTime: function(e){
    this.setData({selectedTime: e.detail.value});
  },

  selectCat: function(e){
    let catIndex = e.detail.value;
    this.setData({catIndex});
  },

  onReset: function(e){
    console.log('重置表单');
    let todayFullDate = new Date(Date.now());
    let todayDate = formatDate(todayFullDate);
    let todayTime = formatTime(todayFullDate); 
    this.setData({
      catIndex: 0,
      selectedDate: todayDate,
      selectedTime: todayTime
    });
  },

  onSubmit: function(e){
    console.log(e);
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