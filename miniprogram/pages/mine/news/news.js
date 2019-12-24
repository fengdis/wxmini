// pages/mine/news/news.js
Page({
  data: {
    news: []
  },
  onLoad: function () {
   var _this = this;
   wx.request({
     url: 'https://www.fengdis.com/blog/blog/web/gbook/gbooks?page=1&rows=10&sort=createdate&order=desc',
    success: function(res) {
      _this.setData({
        news: res.data.content,
      })
    }
   })
  }, 
})