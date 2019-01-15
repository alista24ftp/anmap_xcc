const {ApiHost} = require('../../config.js');
const {failMsg} = require('../../utils/util.js');
Page({
  data: {
    displayType: 0, // 0 - 地图, 1 - 列表
  },

  onLoad: function (options) {
    let that = this;
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
        }else{
          failMsg('获取类型异常');
        }
      },
      fail: function(err){
        failMsg('获取类型失败');
      }
    });
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
  },

  onReady: function (e) {
    //加载小程序地图
    this.mapCtx = wx.createMapContext('myMap');
    let markers = [{
      latitude: 39.870702,
      longitude: 116.426861
    }];
    
    let polyline = [{
      points: [{
        longitude: 116.30006457153318,
        latitude: 39.85968005483189
      }, {
          longitude: 116.28770495239256,
          latitude: 39.86409421057676
      }],
      color: '#FF0000DD',
      arrowLine:true,
      width: 2,
      dottedLine: true
    }];

    this.setData({
      polyline: polyline,
      markers: markers
    })
  },

  selectCat: function(e){
    this.setData({catIndex: e.detail.value});
  },

  displayMap: function(e){
    this.setData({displayType: 0});
  },

  displayList: function (e) {
    this.setData({ displayType: 1 });
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

  clickMap:function(e){
    /*
    //点击地图时触发
    console.log(e);
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          },
          detail_info: res.address,
          wd: res.latitude,
          jd: res.longitude
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
    */
  },

  clickMapPoi:function(e){
    //点击地图poi
    console.log('e');
    console.log(e);
  }
})