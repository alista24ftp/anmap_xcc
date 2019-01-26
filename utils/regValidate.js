const validateUserName = username => {
  if(!username || (username === undefined)){
    return {
      errMsg: '昵称不能为空',
      status: false
    };
  } 
  if(username.length < 2){
    return {
      errMsg: '昵称长度小于2',
      status: false
    };
  } 
  if(!(/^[_\-0-9a-zA-Z\u4E00-\u9FFF]+$/.test(username))){
    return {
      errMsg: '昵称格式错误',
      status: false
    };
  }
  return { status: true };
};

const validatePhone = phone => {
  if(!phone || (phone === undefined)){
    return {
      errMsg: '电话不能为空',
      status: false
    };
  }
  if(phone.length != 11){
    return {
      errMsg: '电话长度错误',
      status: false
    };
  }
  if (!(/^[0-9]+$/.test(phone))){
    return {
      errMsg: '电话必须为数字',
      status: false
    };
  }
  return { status: true };
};

const validateVerifyCode = code => {
  if(!code || (code === undefined)){
    return {
      errMsg: '验证码不能为空',
      status: false
    };
  } 
  if(code.length != 4){
    return {
      errMsg: '验证码长度错误',
      status: false
    };
  } 
  if(!(/^[0-9]+$/.test(code))){
    return {
      errMsg: '验证码格式错误',
      status: false
    };
  }
  return { status: true };
};

const validatePassword = pwd => {
  if(!pwd || (pwd === undefined)){
    return {
      errMsg: '密码不能为空',
      status: false
    };
  } 
  if(pwd.length < 4){
    return {
      errMsg: '密码长度小于4',
      status: false
    };
  } 
  if(!(/^[_0-9a-zA-Z\-]+$/.test(pwd))){
    return {
      errMsg: '密码格式错误',
      status: false
    };
  }
  return { status: true };
};

const validateEmail = email => {
  if (!email || (email === undefined)){
    return {
      errMsg: '邮箱不能为空',
      status: false
    };
  }
  if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
    return {
      errMsg: '邮箱格式错误',
      status: false
    };
  }
  return { status: true };
}; 

const validateSubmit = (phone, code, pwd) => {
  let validPhone = validatePhone(phone);
  let validCode = validateVerifyCode(code);
  let validPwd = validatePassword(pwd);
  if(!validPhone.status){
    return validPhone;
  }
  if (!validCode.status){
    return validCode;
  }
  if (!validPwd.status) {
    return validPwd;
  }
  return { status: true };
};

module.exports = {
  validateUserName, validatePhone, validateVerifyCode, validatePassword, validateEmail, validateSubmit
};