// pages/mine/mine.js
var Utils = require("../../utils/util.js");

// 默认数据
var defaultData = {
  ztBool: false,   // 点击一键微信登陆按钮的点击状态
  code: ""     // 获取login的code 
}

Page({
  data: {
    userInfo: {},
    avatarUrl: '../../assets/images/user-unlogin.png',
    data: defaultData
  },
  /* 
   *  跳转到我的消息页面
   */
  toNews:function(e) {
    wx.navigateTo({
      url:'news/news'
    })
  },
  onLoad: function (options) {
    //   页面加载的时候判断 记住手机号密码是否勾选
    var loginValue = wx.getStorageSync("success");

    this.loginFn(); // 加载登陆信息的接口
    Utils.removeStorage('success');

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.setData({
            avatarUrl: Utils.app.globalData.userInfo.avatarUrl,
            userInfo: Utils.app.globalData.userInfo
          })
        }
      }
    })
  },
  loginFn: function () {     // 判断是否是登陆的状态
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          _this.setData({
            code: res.code
          })
        } else {
          Utils.showModal("获取用户登录状态失败！");
        }
      }
    });
  },
  hrefFn: function () {  // 点击页面记录跳转
    var Reset = wx.getStorageSync("Reset");
    if (Reset) {
      wx.redirectTo({               // 跳转别的页面，关闭当前页面
        url: Reset
      })
    } else {
      wx.redirectTo({               // 跳转别的页面，关闭当前页面
        url: "/pages/Consultation/Consultation"
      })
    }
  },
  mysubmit: function (param) {
    var _this = this;
    var flag = this.checkPhone(param) && this.checkPassword(param);
    loginArr = {        // 本地存储的手机号、密码
      phone: param.phone,
      password: param.password
    }
    if (!!flag) {
      var checkVal = param.checkboxval.join("");
      if (!checkVal.length) {
        Utils.removeStorage('success');
      }
      Utils.requestFn({
        url: '/index.php/Login/index?server=1',
        method: "POST",
        data: {         // 传递的参数
          userphone: param.tel,
          passwd: param.pasd
        },
        success: function (res) {           // 成功、返回的数据
          if (res.data.status) {             // 登陆成功
            Utils.setStorage('success', loginArr);
            _this.hrefFn();
            loginJson = {                // 存储登陆状态      
              image: res.data.data.image,
              nickname: res.data.data.nickname,
              sdk: res.data.data.sdk,
              status: res.data.data.status,
              telphone: res.data.data.telphone,
              types: res.data.data.type,
              uid: res.data.data.uid
            }
            Utils.setStorage("login", loginJson);     // 存储到本地缓存
          } else {
            Utils.showModal(res.data.message);
            return false;
          }
        },
        fail: function () {                      // 失败、调取状态 
          console.log("请求失败")
          _this.failFn();
        }
      })
    }
  },
  checkPhone: function (val) {            // 验证手机号
    var checkVal = Utils.Verification.phone;
    var thisVal = val.tel;
    if (!checkVal.test(thisVal)) {
      Utils.showModal("请输入正确的手机号码");
      return false;
    }
    return true;
  },
  checkPassword: function (val) {          // 验证密码
    var thisVal = val.pasd.trim();
    if (thisVal.length < 6) {
      Utils.showModal("请输入至少6位的密码");
      return false;
    }
    return true;
  },
  checkboxChange: function (e) {            // 记住密码
    var val = e.detail.value;
    Utils.removeStorage('success');
  },
  getPhoneNumber: function (e) {     // 取得授权的手机号码
    this.loginFn();     // 每次点击的获取最新的code
    this.setData({      // 点击的时候过程中不让点击
      ztBool: true
    })
    var iv = e.detail.iv;       // 获取权限的加密iv信息
    var encryptedData = e.detail.encryptedData;  // 获取权限的加密用户信息
    var code = this.data.code;  // 获取login的登陆返回的code
    if (typeof encryptedData == "undefined" && typeof iv == "undefined") {
      Utils.showModal("授权失败");
      this.setData({      // 点击的时候过程中不让点击
        ztBool: false
      })
    } else {
      // 访问登录凭证校验接口获取session_key
      wx.request({
        url: "https://api.weixin.qq.com/sns/jscode2session",
        data: {
          'appid': "wx346d99f92ac9a3b3",
          'secret': "180f5a8608fa9b740f91f35d80e1abef",
          'js_code': this.data.code,
          'grant_type': "authorization_code"
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json'
        }, // 设置请求的 header
        success: function (data) {
          console.log(data)
          wx.request({
            url: 'http://127.0.0.1:8080/service/weChat/getPhoneNumber',
            method: 'GET',
            data: {
              encryptedData: encryptedData,
              iv: iv,
              session_key: data.data.session_key
            },
            success: function (res) {
              if (res.data.status) {
                var userphone = res.data.data.phoneNumber;
                this.getPhoneLoginFn(userphone);   // 穿参请求登录接口
              } else {
                Utils.showModal(res.data.message);
              }
              _this.setData({      // 点击的时候过程中不让点击
                ztBool: false
              })
            }
          })
        },
        fail: function (err) {
          console.log(err);
        }
      })
    }
  },
  
  getPhoneLoginFn: function (mun) {     // 获取登陆手机完成登陆
    var _this = this;
    wx.request({
      url: '/index.php/phonelogin?server=1',
      method: "POST",
      data: {
        userphone: mun
      },
      success: function (res) {

        if (res.data.status) {
          _this.hrefFn();
          loginJson = {                // 存储登陆状态      
            image: res.data.data.image,
            nickname: res.data.data.nickname,
            sdk: res.data.data.sdk,
            status: res.data.data.status,
            telphone: res.data.data.telphone,
            types: res.data.data.type,
            uid: res.data.data.uid
          }
          Utils.setStorage("login", loginJson);     // 存储到本地缓存
        } else {
          Utils.showModal(res.data.message);
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

})