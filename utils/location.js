const chooseLocation = () => {
  return new Promise((resolve, reject)=>{
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        resolve({
          hasLocation: (res.longitude && res.latitude) ? true : false,
          locAddr: res.address !== undefined ? res.address : false,
          locName: res.name !== undefined ? res.name : false,
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

module.exports = {
  chooseLocation
};