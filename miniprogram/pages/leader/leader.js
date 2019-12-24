//index.js
//获取应用实例
const app = getApp()
const currentPage = getCurrentPages

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    color: "#D0021B",
    imgUrls: ['http://qiniu.fengdis.com/images/banner01.jpg', 'http://qiniu.fengdis.com/images/banner02.jpg', 'http://qiniu.fengdis.com/images/banner03.jpg'],
    pageNum: 1,
    pageSize: 10,
    articles: [],
    // id: ''
  },

  onShow: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500);
  },

  onLoad: function () {
    var that = this;
    that.requestData();
  },

  //加载数据
  requestData() {
    var that = this;
    if (that.data.articles.length < 1) {
      wx.showToast({
        title: '加载中',
        duration: 500
      })
    } else {
      wx.showNavigationBarLoading()
    }
    wx.request({
      url: 'https://www.fengdis.com/blog/blog/web/article/articles?page='+ that.data.pageNum +'&rows='+ that.data.pageSize +'&sort=createdate&order=desc',
      data: {
      },
      method: "POST",
      // "Content-Type": "application/x-www-form-urlencoded",
      success: function (res) {
        wx.stopPullDownRefresh()
        that.setData({
          articles: res.data.content,
          // id: res.data.data.articleInfo
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

  onReachBottom: function () {
    // this.data.pageNum++;
    this.data.pageSize = this.data.pageSize + 10;
    this.requestData();
    console.log("刷新")
  },

  onPullDownRefresh: function () {
    // this.data.pageNum = 1;
    this.data.pageSize = 10;
    this.requestData();
    console.log("上拉")
  },

})
