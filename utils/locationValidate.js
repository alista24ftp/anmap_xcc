const validateLongitude = (longitude) => {
  if(longitude === undefined || longitude == ''){
    return {
      errMsg: '经度不能为空',
      status: false
    };
  } 
  if(isNaN(longitude)){
    return {
      errMsg: '经度不是数字',
      status: false
    };
  }
  return { status: true };
};

const validateLatitude = (latitude) => {
  if(latitude === undefined || latitude == ''){
    return {
      errMsg: '纬度不能为空',
      status: false
    };
  } 
  if(isNaN(latitude)){
    return {
      errMsg: '纬度不是数字',
      status: false
    };
  }
  return { status: true };
};

const validateLocName = (name) => {
  if ((name === undefined) || (name.length == 0)){
    return {
      errMsg: '位置名称不能空',
      status: false
    };
  }
  if (!(/^[0-9a-zA-Z\u4E00-\u9FFF\-\(\)\[\]\{\}_]+$/.test(name))){
    return {
      errMsg: '名称格式错误',
      status: false
    };
  }
  return { status: true };
};

const validateLocAddr = (addr) => {
  if (addr === undefined){
    return {
      errMsg: '地址不能为空',
      status: false
    };
  }
  if (addr.length < 3){
    return {
      errMsg: '地址长度小于3',
      status: false
    };
  }
  if (!(/^[_0-9a-zA-Z\- \u3000\u4E00-\u9FFF　\(\)\[\]\{\}]+$/.test(addr))){
    return {
      errMsg: '地址格式错误',
      status: false
    };
  }
  return { status: true };
};

const validateCategory = (category) => {
  if(category === undefined){
    return {
      errMsg: '分类不能为空',
      status: false
    };
  }
  return {status: true};
}

const validateAllInfo = (longitude, latitude, name, addr, category) => {
  let validLng = validateLongitude(longitude);
  let validLat = validateLatitude(latitude); 
  let validName = validateLocName(name);
  let validAddr = validateLocAddr(addr);
  let validCat = validateCategory(category);
  if(!validLng.status) return validLng;
  if(!validLat.status) return validLat;
  if(!validName.status) return validName;
  if(!validAddr.status) return validAddr;
  if(!validCat.status) return validCat;
  return {status: true};
}

module.exports = {
  validateAllInfo
};