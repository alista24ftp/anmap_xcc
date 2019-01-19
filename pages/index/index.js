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
    wx.request({
      url: ApiHost + '/inter/index/article_cats',
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          if(res.data.list.length > 0){
            //let catList = res.data.list.unshift({ cat_name: "所有" });
            let catList = res.data.list;
            getToken().then(token => {
              getAllLocations(token, res.data.list.map(cat=>cat.cat_id)).then(locations => {
                let allLocations = locations.map((location, cIndex)=>{
                  let markers = location.data.filter(loc => loc.is_show == 1).map((loc, i) => {
                    return { id: i + 1, latitude: loc.lat, longitude: loc.lon };
                  });
                  let polyline = location.is_connection == 1 ? [{
                    points: markers.map(m => { return { latitude: m.latitude, longitude: m.longitude } }),
                    color: '#' + res.data.list[cIndex].cat_description,
                    arrowLine: true,
                    width: 2,
                    dottedLine: true
                  }] : []; 
                  location.markers = markers;
                  location.polyline = polyline;
                  location.showLine = location.is_connection == 1;
                  return location;
                });

                let firstOption = {};
                firstOption.markers = allLocations.map(location=>location.markers).reduce((a,b)=>a.concat(b), []).map((marker, i)=>{
                  marker.id = i+1;
                  return marker;
                });
                firstOption.polyline = allLocations.map(location=>location.polyline).reduce((a,b)=>a.concat(b),[]);
                firstOption.data = allLocations.map(location=>location.data).reduce((a,b)=>a.concat(b), []);
                firstOption.showLine = true;
                
                allLocations.unshift(firstOption);
                catList.unshift({ cat_name: "所有" });

                that.setData({
                  allLocations: allLocations,
                  catList: catList,
                  catIndex: 0 
                });
              }, err => {
                failMsg('获取不到列表');
              });
            }, err => {
              goLogin();
            });
          }else{
            that.setData({
              catList: [],
              catIndex: -1
            });
          }
          
        } else {
          failMsg('获取类型异常');
          that.setData({
            catList: [],
            catIndex: -1
          });
        }
      },
      fail: function (err) {
        failMsg('获取类型失败');
        that.setData({
          catList: [],
          catIndex: -1
        });
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
    console.log(this.data);
  },

  displayMap: function(e){
    let that = this;
    this.setData({displayType: 0});
  },

  displayList: function (e) {
    let that = this;
    this.setData({ displayType: 1 });
  },

  edit: function(e){
    let locIndex = e.currentTarget.dataset.index;
    let {allLocations, catIndex} = this.data;
    let location = allLocations[catIndex].data[locIndex];
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