const {ApiHost} = require('../../config.js');
const {failMsg} = require('../../utils/util.js');
const {getToken, goLogin} = require('../../utils/login.js');
const {getLocationsByCat, getCurrentLocation} = require('../../utils/location.js');
Page({
  data: {
    displayType: 0, // 0 - 地图, 1 - 列表
  },

  onLoad: function (options) { 
    
  },

  onReady: function (e) {
    //加载小程序地图
    this.mapCtx = wx.createMapContext('myMap');
  },

  onShow: function(){
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
          }, ()=>{
            if(res.data.list.length > 0){
              that.getLocations(res.data.list[0].cat_id, '#'+res.data.list[0].cat_description);
            }
          });
        } else {
          failMsg('获取类型异常');
        }
      },
      fail: function (err) {
        failMsg('获取类型失败');
      }
    });
    //获取当前坐标
    getCurrentLocation().then(location => {
      that.setData(location);
    }, err => {
      failMsg('无法定当前位置');
    });
  },

  selectCat: function(e){
    this.setData({ catIndex: e.detail.value });
    this.getLocations(this.data.catList[e.detail.value].cat_id, '#'+this.data.catList[e.detail.value].cat_description);
  },

  getLocations: function(catId, catColor){
    let that = this;
    if(that.data.displayType == 0){
      // 地图
      getToken().then(token => {
        getLocationsByCat(token, catId).then(locData => {
          console.log(locData);
          let markers = locData.data.filter(loc=>loc.is_show == 1).map((loc, i)=>{
            return {id: i+1, latitude: loc.lat, longitude: loc.lon};
          });
          let polyline = locData.is_connection == 1 ? [{
            points: markers.map(m=>{return {latitude: m.latitude, longitude: m.longitude}}),
            color: catColor,
            arrowLine: true,
            width: 2,
            dottedLine: true
          }] : []; 
          that.setData({
            markers, 
            polyline,
            locations: locData.data,
            showLine: locData.is_connection == 1
          });
        }, err => {
          failMsg('获取不到列表');
        });
      }, err=>{});
    }else{
      // 列表
      getToken().then(token=>{
        getLocationsByCat(token, catId).then(locData=>{
          console.log(locData);
          that.setData({
            locations: locData.data,
            showLine: locData.is_connection == 1
          });
        }, err=>{
          failMsg('获取不到列表');
        });
      }, err=>{
        goLogin();
      });
    }
  },

  displayMap: function(e){
    let that = this;
    this.setData({displayType: 0}, ()=>{
      that.getLocations(that.data.catList[that.data.catIndex].cat_id, '#'+that.data.catList[that.data.catIndex].cat_description);
    });
  },

  displayList: function (e) {
    let that = this;
    this.setData({ displayType: 1 }, ()=>{
      that.getLocations(that.data.catList[that.data.catIndex].cat_id, '#'+that.data.catList[that.data.catIndex].cat_description);
    });
  },

  edit: function(e){
    let locIndex = e.currentTarget.dataset.index;
    let location = this.data.locations[locIndex];
    let locData = {
      hasLocation: true,
      locAddr: location.address,
      locName: location.name,
      locCom: location.remarks,
      latitude: Number(location.lat),
      longitude: Number(location.lon),
      artId: location.article_id,
      selectedTime: Number(location.input_time) * 1000,
      catId: location.cat_id
    }
    wx.navigateTo({
      url: '/pages/add/add?type=edit&locdata=' + JSON.stringify(locData)
    });
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
        latitude: 39.85856,
        longitude: 116.28616,
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

  addLocation: function(e){
    wx.navigateTo({
      url: '/pages/chooseLocation/chooseLocation'
    });
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