const {ApiHost} = require('../config.js');

const chooseLocation = () => {
  return new Promise((resolve, reject)=>{
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        resolve({
          hasLocation: (res.longitude && res.latitude) ? true : false,
          locAddr: res.address !== undefined ? res.address : false,
          locName: res.name !== undefined ? res.name : false,
          locCom: false,
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: function (err) {
        // fail
        reject('取消选择位置');
      }
    });
  });
};

const getLocationsByCat = (token, catId) => {
  return new Promise((resolve, reject)=>{
    wx.request({
      url: ApiHost + '/inter/home/articleGetList',
      method: 'POST',
      data: {
        token,
        cat_id: catId
      },
      success: function (res) {
        console.log(res);
        if(res.data.code == 200){
          resolve(res.data);
        }else{
          reject('获取位置失败');
        }
      },
      fail: function (err) {
        reject('获取位置失败');
      }
    });
  });
};

const getAllLocations = (token, catIds) => {
  return Promise.all(catIds.map(id=>getLocationsByCat(token, id)));
};

const getCurrentLocation = () => {
  return new Promise((resolve, reject)=>{
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: function(){
        reject('无法获取当前位置');
      }
    })
  });
};

module.exports = {
  chooseLocation,
  getLocationsByCat,
  getCurrentLocation,
  getAllLocations
};