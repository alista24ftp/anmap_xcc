// pages/add/add.js
const {ApiHost} = require('../../config.js');
const {formatDate, formatTime, failMsg, successMsg} = require('../../utils/util.js');
const {validateAllInfo} = require('../../utils/locationValidate.js');

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
    console.log(options);
    let that = this;
    let todayFullDate = new Date(Date.now());
    let todayDate = formatDate(todayFullDate);
    let todayTime = formatTime(todayFullDate);
    if(options.type == 'add'){
      let locData = JSON.parse(options.locdata);
      locData.type = 'add';
      that.setData(locData);
    }else{
      that.setData({type: 'edit'});
    }
    that.setData({
      selectedDate: todayDate,
      selectedTime: todayTime
    });
    wx.request({
      url: ApiHost + '/inter/index/article_cats',
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          that.setData({
            catList: res.data.list,
            catIndex: 0
          });
        } else {
          failMsg('获取类型异常');
        }
      },
      fail: function (err) {
        failMsg('获取类型失败');
      }
    });
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
    let {locname, locaddr, loccom} = e.detail.value;
    let that = this;
    let {latitude, longitude, catList, catIndex, selectedDate, selectedTime} = that.data;
    let catId = catList[catIndex].cat_id;
    if(validateAllInfo(longitude, latitude, locname, locaddr, catId)){
      // 提交表单
      let postData = {
        token,
        cat_id: catId,
        lat: latitude,
        lon: longitude,
        name: locname,
        address: locaddr,
        remarks: loccom,
        input_time: new Date(selectedDate + ' ' + selectedTime).getTime(),
      };
      if(that.data.type == 'edit'){
        postData.article_id = that.data.artId;
      }
      wx.request({
        url: ApiHost + '/inter/home/addArticle',
        method: 'POST',
        data: postData,
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            if(res.data.status == 1){
              wx.reLaunch({
                url: '/pages/index/index',
                success: function(res){
                  successMsg('提交成功');
                }
              });
            }else{
              failMsg('提交失败');
            }
          }else{
            failMsg('提交参数错误');
          }
        },
        fail: function(err){
          failMsg('无法提交信息');
        }
      });
    }else{
      failMsg('位置信息错误');
    }
  },

  goBack: function(e){
    if(this.data.type == 'add'){
      wx.redirectTo({
        url: '/pages/chooseLocation/chooseLocation'
      });
    }else {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  homepage: function(e){
    wx.navigateBack({
      delta: 1
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
      console.log('shown');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('hide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('unload');
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