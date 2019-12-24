//app.js
App({
  globalData: {
    userInfo: {}
  },
  /**
   * 小程序初始化完成时触发，全局只触发一次
   */
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }


    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    // 头部追加数据
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      timeout: 100000,
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: res => {
        console.log(res)
      },
      complete: res => {
        console.log(res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  /**
   * 小程序启动，或从后台进入前台显示时触发
   */
  onShow: function () {

  },
  /**
   * 小程序从前台进入后台时触发
   */
  onHide: function () {

  },
  /**
   * 小程序发生脚本错误或 API 调用报错时触发
   */
  onError: function () {

  },
  /**
   * 小程序要打开的页面不存在时触发
   */
  onPageNotFound: function () {
    wx.redirectTo({
      url: 'pages/...'
    }) // 如果是 tabbar 页面，请使用 wx.switchTab
  },

  getOpenId: function () {
    //根据code获取openid等信息
    wx.login({
      success: function (res) {
        var code = res.code; //返回code
        var appId = 'xxx';
        var secret = 'xxx';
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            var openid = res.data.openid
            var sessionKey = res.data.sessionKey
            console.log('openid为' + openid + ',sessionKey为' + sessionKey);
          }
        })
      }
    })
  },

  checkSession: function () {
    wx.checkSession({
      success: function () {
        console.log("session未过期，并且在本生命周期一直有效")
      },
      fail: function () {
        console.log("session过期，需要重新登录")
        wx.login() //重新登录
      }
    })
  }
})
