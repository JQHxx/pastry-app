const app = getApp();

Page({
  data: {},
  onLoad: function (e) {
    let follow = this.selectComponent("#follow");
    follow.init(e.id, true);
    this.setData({
      nickname: e.nickname
    })
  }
})