// pages/types/types.js
Page({
  data: {
    bookList:[],
    stack:[]
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../../logs/logs'
    })
  },
  onLoad: function (params) {
    var that = this;
    wx.request({
      url:'https://www.fengdis.com/blog/blog/web/gbook/gbooks?page=1&rows=10&sort=createdate&order=desc',
      success: function(res) {
        var bTypes = res.data.data.stack[params.id].bookTypes;
        wx.setNavigationBarTitle({ 
          title: bTypes,
        },1);
        that.setData({
          bookList: res.data.data.stack[params.id].List.bookList,
        })  
      }
    })
  },
})