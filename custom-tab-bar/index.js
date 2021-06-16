Component({
  options:{
    addGlobalClass: false
  },
  data: {
    show: true,
    index: 0,
    tabList: [{
      "pagePath": "/pages/home/home"
    }, {
      "pagePath": "/pages/discovery/discovery"
    }, {
      "pagePath": "/pages/post/post"
    }, {
      "pagePath": "/pages/message/message"
    }, {
      "pagePath": "/pages/my/my"
    }]
  },
  methods: {
    switchTab(e) {
      let cur = Number(e.currentTarget.dataset.cur);
      if (this.data.index !== cur) {
        this.setData({
          index: cur
        });
        wx.switchTab({
          url: this.data.tabList[cur].pagePath
        })
      }
    }
  }
})