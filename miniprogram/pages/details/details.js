// pages/main/main.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      articleId: options.id,
    });
    console.log("文章Id" + options.id)
    
    that.requestData(this.data.articleId)
  },

  requestData(articleId) {
    var that = this;
    wx.request({
      url: "https://www.fengdis.com/blog/blog/web/article/" + articleId,
      data: {
      },
      method: "POST",
      // "Content-Type": "application/x-www-form-urlencoded",
      success: function (res) {
        that.setData({
          dataInfo: res.data,
        })
      },
      fail: function () {
        wx.showModal({
          title: '加载出错',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast()
        wx.hideNavigationBarLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindKeyInputAge: function (e) {
    this.setData({
      age: e.detail.value
    })
  },
  bindKeyInputId: function (e) {
    this.setData({
      recordId: e.detail.value
    })
  }

})