//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'wxmini-bea5b6',
        traceUser: true,
      })
    }

    // wx.getLocation({
    //   success: function (res) {
    //     this.globalData.longitude = res.longitude,
    //       this.globalData.latitude = res.latitude//这里是获取经纬度
    //   },

    // })

    this.globalData = {}
  }
})
