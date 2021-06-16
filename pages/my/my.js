const app = getApp();
import {
  getUserStatistics
} from "../../http/api"

Page({
  data: {
    trigger: false,
    statistic: {}
  },
  onLoad: function () {
    this.refresh();
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        index: 4
      })
    }
  },
  refresh() {
    this.setData({
      trigger: false,
      user: app.getItem('user')
    })
    this.loadStatistic();
  },
  loadStatistic() {
    app.get(getUserStatistics, {
      "userId": this.data.user.id
    }, {
      loading: false
    }).then(res => {
      this.setData({
        statistic: res
      })
    })
  },
  navToProfile() {
    app.router("profile");
  },
  navToBlog() {
    app.router("myBlog", {
      query: {
        "id": this.data.user.id,
        "nickname": this.data.user.nickname
      }
    });
  },
  navToFollow() {
    app.router("follow", {
      query: {
        "id": this.data.user.id,
        "nickname": this.data.user.nickname
      }
    });
  },
  navToFans() {
    app.router("fans", {
      query: {
        "id": this.data.user.id,
        "nickname": this.data.user.nickname
      }
    });
  },
})