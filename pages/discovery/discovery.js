import {
  rankList
} from "../../http/api"

Page({
  data: {},
  onLoad: function () {
    let blog = this.selectComponent("#blog");
    blog.init(rankList, {});
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        index: 1
      })
    }
  }
});