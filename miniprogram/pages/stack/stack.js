
Page({
    data: {
      stacks:[],
      // id: ""
    }, 
    onLoad: function () {
      var that = this;
      wx.request({
        url: 'https://www.fengdis.com/blog/blog/web/gbook/gbooks?page=1&rows=10&sort=createdate&order=desc',
        success: function(res) {
          console.log(res.data.content);
          that.setData({
            stacks: res.data.content,
            // id: res.data.data.List
          })
        }
      })
    },   
  })