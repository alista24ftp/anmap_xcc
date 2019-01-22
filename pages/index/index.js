const {ApiHost} = require('../../config.js');
const {failMsg} = require('../../utils/util.js');
const {getToken, goLogin} = require('../../utils/login.js');
const {getLocationsByCat, getCurrentLocation, getAllLocations} = require('../../utils/location.js');
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
    that.getCategories().then(categories=>{
      getToken().then(token => {
        that.setData({
          catList: [{cat_id: 0, cat_name: "所有"}].concat(categories),
          catIndex: 0
        });
        that.setLocations(token, 0);
      }, err => {
        goLogin();
      });
    }, err=>{
      failMsg(err);
      that.setData({
        catList: [],
        catIndex: -1,
        allLocations: [],
        markers: [],
        polyline: []
      });
    });
    
    //获取当前坐标
    getCurrentLocation().then(location => {
      that.setData(location);
    }, err => {
      failMsg('无法定当前位置');
    });
  },

  getCategories: function(){
    return new Promise((resolve, reject)=>{
      wx.request({
        url: ApiHost + '/inter/index/article_cats',
        method: 'POST',
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            if (res.data.list.length > 0) {
              //let catList = res.data.list.unshift({ cat_name: "所有" });
              resolve(res.data.list);
            }else{
              reject('没有类型');
            }
          }else{
            reject('获取类型异常');
          }
        },
        fail: function(err){
          reject('获取类型失败');
        }
      });
    });
  },

  setLocations: function(token, catId){
    let that = this;
    getLocationsByCat(token, catId).then(locations => {
      console.log(locations);
      let allLocations = catId == 0 ? locations.list : locations.data;
      let markers = allLocations.filter(loc => loc.is_show == 1).map((loc, i) => {
        return {
          id: i + 1,
          latitude: loc.lat,
          longitude: loc.lon
        };
      });
      let polyline;
      if(catId == 0){
        polyline = locations.data.map(category => {
          let points = locations.list.filter(loc => loc.cat_id == category.cat_id && loc.is_show == 1).map(loc => {
            return {
              longitude: loc.lon,
              latitude: loc.lat
            };
          });
          return {
            points,
            color: '#' + category.cat_description,
            arrowLine: true,
            width: 2,
            dottedLine: true
          };
        });
      }else{
        polyline = locations.is_connection == 1 ? [{
          points: locations.data.filter(loc=>loc.is_show==1).map(loc=>{
            return {longitude: loc.lon, latitude: loc.lat};
          }),
          color: '#' + locations.cat_description,
          arrowLine: true,
          width: 2,
          dottedLine: true
        }] : [];
      }
      
      that.setData({
        allLocations,
        markers,
        polyline
      });
    }, err => {
      failMsg(err);
      that.setData({
        allLocations: [],
        markers: [],
        polyline: []
      });
    });
  },

  selectCat: function(e){
    let catList = this.data.catList;
    let catId = catList[e.detail.value].cat_id; 
    this.setData({ catIndex: e.detail.value });
    let that = this;
    getToken().then(token=>{
      that.setLocations(token, catId);
    }, err=>{
      goLogin();
    });
    
  },

  displayMap: function(e){
    this.setData({displayType: 0});
  },

  displayList: function (e) {
    this.setData({ displayType: 1 });
  },

  edit: function(e){
    let locIndex = e.currentTarget.dataset.index;
    let {allLocations, catIndex} = this.data;
    let location = allLocations[locIndex];
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
    this.mapCtx.moveToLocation();
    console.log(this.data.catList);
    console.log(this.data.allLocations);
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
    
  },

  clickMapPoi:function(e){
    console.log(e);
  }
})