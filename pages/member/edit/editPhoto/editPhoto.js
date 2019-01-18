// pages/member/edit/editPhoto/editPhoto.js
const {ApiHost} = require('../../../../config.js');
const {getLoginData, goLogin} = require('../../../../utils/login.js');
const {formatImg, successMsg, failMsg, uploadImgs} = require('../../../../utils/util.js');
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

  chooseImg: function (e) {
    let that = this;
    getLoginData().then(loginData=>{
      that.setData({
        afterChoose: true
      }, () => {
        wx.chooseImage({
          count: 1,
          success: function (res) {
            const tempFilePaths = res.tempFilePaths
            console.log(tempFilePaths);
            uploadImgs(loginData.loginToken, tempFilePaths).then(imgDataList => {
              that.setData({
                disabled: false,
                photoLink: imgDataList[0].photoLink,
                fullPhotoLink: imgDataList[0].fullPhotoLink
              });
              successMsg('上传图片成功');
            }, err => {
              console.error(err);
              failMsg(err);
            });
          },
          fail: function (err) {
            console.error('取消选择图片');
          }
        });
      });
    }, err=>{
      goLogin();
    });
    
  },

  editImg: function(e){
    if(!this.data.disabled){
      let that = this;
      getLoginData().then(loginData=>{
        let userInfo = loginData.user;
        let token = loginData.loginToken;
        let photoLink = that.data.photoLink;
        let fullPhotoLink = that.data.fullPhotoLink;
        wx.request({
          url: ApiHost + '/inter/home/updateMsg',
          method: 'POST',
          data: {
            data: photoLink,
            token: token,
            type: 4
          },
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                console.log('修改头像成功');
                userInfo.user_img = photoLink;
                userInfo.user_photo = fullPhotoLink;
                wx.setStorage({
                  key: 'userinfo',
                  data: {
                    user: userInfo,
                    loginToken: token
                  },
                  success: function(res){
                    wx.navigateBack({
                      delta: 1,
                      success: function(res){
                        successMsg('修改头像成功');
                      }
                    });
                  }
                });
                
              } else if (res.data.type == 2) {
                console.error('修改头像失败');
                failMsg('修改头像失败');
              } else {
                console.error('修改头像参数错误');
                failMsg('修改参数错误');
              }
            } else {
              console.error('修改头像状态异常');
              failMsg('修改状态异常');
            }
          }
        });
      }, err=>{
        goLogin();
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
    if(!this.data.afterChoose){
      let that = this;
      getLoginData().then(loginData => {
        that.setData({
          disabled: true,
          photoLink: loginData.user.user_img,
          fullPhotoLink: loginData.user.user_photo
        });
      }, err => {
        goLogin();
      });
    }else{
      this.setData({
        afterChoose: false
      });
    }
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