const app = getApp();

Page({
  data: {},
  onLoad: function (e) {
    let follow = this.selectComponent("#follow");
    follow.init(e.id, false);
    this.setData({
      nickname: e.nickname
    })
  }
})