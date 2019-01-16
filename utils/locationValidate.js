const validateLongitude = (longitude) => (longitude !== undefined) && !isNaN(longitude);
const validateLatitude = (latitude) => (latitude !== undefined) && !isNaN(latitude);
const validateLocName = (name) => (name !== undefined) && (name.length > 0) && (/^[0-9a-zA-Z\u4E00-\u9FFF\-\(\)\[\]\{\}_]+$/.test(name));
const validateLocAddr = (addr) => (addr !== undefined) && (addr.length >= 3) && (/^[_0-9a-zA-Z\- \u3000\u4E00-\u9FFF　\(\)\[\]\{\}]+$/.test(addr));
const validateCategory = (category) => category !== undefined;
const validateAllInfo = (longitude, latitude, name, addr, category) => {
  return validateLongitude(longitude) 
    && validateLatitude(latitude) 
    && validateLocName(name)
    && validateLocAddr(addr)
    && validateCategory(category);
}

module.exports = {
  validateAllInfo
};