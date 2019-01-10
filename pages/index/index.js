Page({
  data: {
   
  },
  onReady: function (e) {
    //加载小程序地图
    this.mapCtx = wx.createMapContext('myMap');
  },
  getCenterLocation: function () {
    //获取位置
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    //移动到当前位置
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    //移动标注
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    //缩放展示经纬度
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 39.85599039336933,
        longitude: 116.31199503723143,
      }, {
          latitude: 39.872526435070164,
          longitude: 116.30633021179197,
      }]
    })
  },
  onLoad:function(e){
    let that = this;
    //获取当前坐标
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  }
})