// pages/member/edit/editPhone/editPhone.js
const {ApiHost} = require('../../../../config.js');
const {validatePhone, validateVerifyCode} = require('../../../../utils/regValidate.js');
const {getLoginData, goLogin} = require('../../../../utils/login.js');
const {failMsg, successMsg} = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    disableVerify: true
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
    getLoginData().then(loginData=>{}, err=>{
      goLogin();
    });
  },

  reset: function(e){
    this.setData({
      phone: '',
      disabled: true,
      disableVerify: true,
      showCodeEntry: false
    });
  },

  checkPhone: function(e){
    let validPhone = validatePhone(e.detail.value);
    this.setData({
      phone: e.detail.value,
      disableVerify: !validPhone.status
    });
    if(!validPhone.status){
      this.setData({showCodeEntry: false, disabled: true});
    }
  },

  getCode: function(e){
    if(!this.data.disableVerify){
      let phoneNum = e.target.dataset.phone;
      let that = this;
      let validPhone = validatePhone(phoneNum);
      if (validPhone.status) {
        wx.request({
          url: ApiHost + '/xcc/Login/verificationCode',
          method: 'POST',
          data: {
            user_tel: phoneNum
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 200 && res.data.type == 1) {
              successMsg('验证码发送成功');
              that.setData({
                verifyCode: res.data.data,
                showCodeEntry: true
              });
            } else {
              console.error(res);
              failMsg('验证码发送失败');
              that.setData({showCodeEntry: false, disabled: true});
            }
          },
          fail: function (err) {
            console.error(err);
            failMsg('无法获取验证码');
            that.setData({showCodeEntry: false, disabled: true});
          }
        });
      } else {
        console.error('手机号不正确');
        failMsg(validPhone.errMsg);
        that.setData({showCodeEntry: false, disabled: true});
      }
    }
  },

  checkCode: function(e){
    if(validateVerifyCode(e.detail.value).status && e.detail.value == this.data.verifyCode){
      this.setData({disabled: false});
    }else{
      this.setData({disabled: true});
    }
  },

  submit: function(e){
    console.log(e);
    console.log(this.data);
    let validPhone = validatePhone(e.detail.value.phone);
    if(!this.data.disabled && validPhone.status){
      getLoginData().then(loginData=>{
        wx.request({
          url: ApiHost + '/inter/home/updateMsg',
          method: 'POST',
          data: {
            token: loginData.loginToken,
            data: e.detail.value.phone,
            type: 2
          },
          success: function(res){
            if(res.data.code == 200){
              if(res.data.type == 1){
                loginData.user.user_tel = e.detail.value.phone;
                wx.setStorage({
                  key: 'userinfo',
                  data: loginData,
                  success: function(res){
                    wx.navigateBack({
                      delta: 1,
                      success: function (res) {
                        successMsg('修改成功');
                      }
                    });
                  }
                });
              }else{
                failMsg('修改失败');
              }
            }else if(res.data.code == 400){
              failMsg('修改参数错误');
            }else{
              failMsg('用户不存在');
            }
          }
        });
      }, err=>{
        goLogin();
      });
    }else if(!validPhone.status){
      failMsg(validPhone.errMsg);
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