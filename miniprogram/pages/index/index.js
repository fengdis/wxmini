//index.js
//获取应用实例
const app = getApp()
const currentPage = getCurrentPages
Page({
  onReachBottom: function () {
    this.data.pageNum++;
    this.requestData();
    console.log("刷新")
  },
  onPullDownRefresh: function () {
    this.data.pageNum = 1;
    this.requestData();
    console.log("上拉")
  },
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    color: "#D0021B",
    imgUrls: ['http://qiniu.fengdis.com/images/banner01.jpg', 'http://qiniu.fengdis.com/images/banner02.jpg', 'http://qiniu.fengdis.com/images/banner03.jpg'],

    pageNum: 0,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.requestData();
  },
  
  // 查看详情
  showDetail(event) {
    var storeId = event.currentTarget.dataset.storeid;
    var address = event.currentTarget.dataset.adress;
    var sflist = JSON.stringify(event.currentTarget.dataset.sflist);
    wx.navigateTo({
      url: '../cart/cart?storeId=' + storeId + "&address=" + address + "&sflist=" + sflist
    })
  },

  //加载数据
  requestData() {
    var that = this;
    if (that.data.dataList.length < 1) {
      wx.showToast({
        title: '加载中',
        duration: 500
      })
    } else {
      wx.showNavigationBarLoading()
    }
    wx.request({
      url: "https://www.fengdis.com/blog/blog/web/article/articles?page=1&rows=15&sort=createdate&order=desc",
      data: {
      },
      method: "POST",
      // "Content-Type": "application/x-www-form-urlencoded",
      success: function (res) {
        wx.stopPullDownRefresh()
        
        that.setData({
          dataList: res.data.content
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

})
