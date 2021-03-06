// pages/member/edit/editPassword/editPassword.js
const { ApiHost } = require('../../../../config.js');
const { validatePassword } = require('../../../../utils/regValidate.js');
const { getLoginData, goLogin } = require('../../../../utils/login.js');
const { failMsg, successMsg } = require('../../../../utils/util.js');
const { hex_md5 } = require('../../../../lib/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true
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
    getLoginData().then(loginData => { }, err => {
      goLogin();
    });
  },

  reset: function (e) {
    this.setData({
      disabled: true
    });
  },

  checkPwd: function (e) {
    this.setData({
      disabled: !validatePassword(e.detail.value).status
    });
  },

  submit: function (e) {
    console.log(e);
    let validPwd = validatePassword(e.detail.value.pwd);
    if (!this.data.disabled && validPwd.status) {
      getLoginData().then(loginData => {
        wx.request({
          url: ApiHost + '/inter/home/updateMsg',
          method: 'POST',
          data: {
            token: loginData.loginToken,
            data: hex_md5(e.detail.value.pwd),
            type: 3
          },
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                wx.navigateBack({
                  delta: 1,
                  success: function (res) {
                    successMsg('修改成功');
                  }
                });
              } else {
                failMsg('修改失败');
              }
            } else if (res.data.code == 400) {
              failMsg('修改参数错误');
            } else {
              failMsg('用户不存在');
            }
          }
        });
      }, err => {
        goLogin();
      });
    } else if(!validPwd.status){
      failMsg(validPwd.errMsg);
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