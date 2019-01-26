// pages/add/add.js
const {ApiHost} = require('../../config.js');
const {formatDate, formatTime, convertToTimestamp, failMsg, successMsg} = require('../../utils/util.js');
const {validateAllInfo} = require('../../utils/locationValidate.js');
const {getToken, goLogin} = require('../../utils/login.js');

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
    let locData = JSON.parse(options.locdata);
    if (options.type == 'add') {
      locData.type = 'add';
      let todayFullDate = new Date(Date.now());
      let todayDate = formatDate(todayFullDate);
      let todayTime = formatTime(todayFullDate);
      locData.selectedDate = todayDate;
      locData.selectedTime = todayTime;
      that.setData(locData);
    } else {
      locData.type = 'edit';
      let fullDate = new Date(locData.selectedTime);
      locData.selectedDate = formatDate(fullDate);
      locData.selectedTime = formatTime(fullDate);
      that.setData(locData);
    }
    wx.request({
      url: ApiHost + '/inter/index/article_cats',
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          let catList = res.data.list;
          if(options.type == 'add'){
            that.setData({
              catList,
              catIndex: 0
            });
          }else{
            let idx = catList.map(cat => cat.cat_id).findIndex(id => id == locData.catId);
            that.setData({
              catList,
              catIndex: (idx >= 0) ? idx : 0
            });
          }
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
    console.log(e);
    let todayFullDate = new Date(Date.now());
    let todayDate = formatDate(todayFullDate);
    let todayTime = formatTime(todayFullDate); 
    let locAddr = this.data.locAddr;
    this.setData({
      catIndex: 0,
      selectedDate: todayDate,
      selectedTime: todayTime,
      locAddr: locAddr
    });
  },

  onSubmit: function(e){
    console.log(e);
    let {locname, locaddr, loccom} = e.detail.value;
    let that = this;
    let {latitude, longitude, catList, catIndex, selectedDate, selectedTime} = that.data;
    let inputTime = convertToTimestamp(selectedDate, selectedTime);
    let catId = catList[catIndex].cat_id;
    let validAll = validateAllInfo(longitude, latitude, locname, locaddr, catId);
    if(validAll.status){
      // 提交表单
      getToken().then(token=>{
        let postData = {
          token,
          cat_id: catId,
          lat: latitude,
          lon: longitude,
          name: locname,
          address: locaddr,
          remarks: loccom,
          input_time: inputTime
        };
        if (that.data.type == 'edit') {
          postData.article_id = that.data.artId;
        }
        
        console.log(postData);
        wx.request({
          url: ApiHost + '/inter/home/addArticle',
          method: 'POST',
          data: postData,
          success: function (res) {
            console.log(res);
            if (res.data.code == 200) {
              if (res.data.status == 1) {
                wx.reLaunch({
                  url: '/pages/index/index',
                  success: function (res) {
                    successMsg('提交成功');
                  }
                });
              } else {
                failMsg('提交失败');
              }
            } else {
              failMsg('提交参数错误');
            }
          },
          fail: function (err) {
            failMsg('无法提交信息');
          }
        });
      }, err=>{
        goLogin();
      });
    }else{
      failMsg(validAll.errMsg);
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