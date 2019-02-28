const regeneratorRuntime = require('../../lib/runtime.js');
const {ApiHost} = require('../../config.js');
const {failMsg, getSettings} = require('../../utils/util.js');
const {getToken, getLoginData, setLoginData, goLogin} = require('../../utils/login.js');
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
      getLoginData().then(loginData => {
        setLoginData(loginData).then(data=>{
          that.setData({
            catList: [{ cat_id: 0, cat_name: "所有类别" }].concat(categories),
            catIndex: 0,
            isBoss: data.user.is_boos == 1,
            userId: data.user.user_id
          });

          that.getEmps(data.loginToken).then(emps => {
            console.log(emps);
            that.setData({
              empList: [{ user_id: 0, user_name: "所有人" }].concat(emps),
              empIndex: 0
            });
            that.setLocations(data.loginToken, 0, 0);
          }, err => {
            that.setData({
              empList: [],
              empIndex: -1
            });
            that.setLocations(data.loginToken, 0, null);
          });
        }, err=>{
          goLogin();
        });
      }, err => {
        // goLogin();
        that.setData({
          catList: [{ cat_id: 0, cat_name: "所有类别" }].concat(categories),
          catIndex: 0,
          isBoss: false,
          empList: [],
          empIndex: -1,
          allLocations: [],
          markers: [],
          polyline: []
        });
      });
    }, err=>{
      failMsg(err);
      that.setData({
        catList: [],
        catIndex: -1,
        isBoss: false,
        empList: [],
        empIndex: -1,
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

    getSettings().then(settings=>{
      that.setData({
        sharedMsg: settings.sharedMsg,
        sharedImg: settings.sharedImg
      });
    }, err=>{
      failMsg('无法获取配置');
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

  getEmps: function(token){
    return new Promise((resolve, reject)=>{
      wx.request({
        url: ApiHost + '/inter/home/group',
        method: 'POST',
        data: {token},
        success: function(res){
          console.log(res);
          if(res.data.code !== 400){
            if(res.data.type == 1){
              resolve(res.data.data);
            }else{
              reject('没有业务员');
            }
          }
          resolve(res);
        },
        fail: function(err){
          console.error(err);
          reject('获取业务员错误');
        }
      });
    });
  },

  setLocations: function(token, catId, userId){
    let that = this;
    getLocationsByCat(token, catId, userId).then(locations => {
      console.log(locations);
      let allLocations = catId == 0 ? locations.list : locations.data;
      let markers = allLocations.filter(loc => loc.is_show == 1).map((loc, i) => {
        return {
          id: i + 1,
          latitude: loc.lat,
          longitude: loc.lon,
          iconPath: '',
          callout: {
            content: '姓名: ' + loc.user_name + '\n单位名称: ' + loc.name + '\n类型: ' + loc.cat_name + '\n备注: ' + (loc.remarks ? loc.remarks : ''),
            padding: '15rpx'
          }
        };
      });
      let polyline = [];
      /*
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
      }*/
      
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

  selectEmp: function(e){
    let empList = this.data.empList;
    let empId = empList[e.detail.value].user_id;
    let that = this;
    that.setData({ empIndex: e.detail.value }, ()=>{
      that.selectCat({ detail: { value: that.data.catIndex } });
    });
    
  },

  selectCat: function(e){
    let catList = this.data.catList;
    let userId = null;
    if(this.data.isBoss){
      userId = this.data.empList[this.data.empIndex].user_id;
    }
    let catId = catList[e.detail.value].cat_id; 
    this.setData({ catIndex: e.detail.value });
    let that = this;
    getToken().then(token=>{
      that.setLocations(token, catId, userId);
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
    let that = this;
    getLoginData().then(loginData=>{
      let locIndex = e.currentTarget.dataset.index;
      let { allLocations, catIndex } = that.data;
      let location = allLocations[locIndex];
      if (loginData.user.user_id == location.user_id) {
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
      }
    }, err=>{
      goLogin();
    });
    
  },

  markerTap: function(e){
    console.log(e);
    let markerId = e.markerId;

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
  },

  onShareAppMessage: function(res){
    console.log(res);
    let that = this;
    return {
      title: that.data.sharedMsg,
      imageUrl: that.data.sharedImg
    };
  }
})