const app = getApp();
import {
  blogPage,
  getUserInfo,
  getUserStatistics,
  followOp
} from "../../http/api"

Page({
  data: {
    user: {},
    statistic: {}
  },
  onLoad: function (e) {
    this.setData({
      id: e.id
    })
    this.checkFollow();
    this.loadUserInfo();
    this.loadStatistic();
  },
  onReady: function () {
    let blog = this.selectComponent("#blog");
    blog.init(blogPage, {
      "userId": this.data.id
    });
  },
  checkFollow() {
    app.get(followOp, {
      "bloggerId": this.data.id
    }, {
      loading: false
    }).then(res => {
      this.setData({
        follow: res
      })
    })
  },
  follow(e) {
    app.post(followOp + '/' + this.data.id, {}, {
      loading: false
    }).then(res => {
      this.setData({
        follow: res
      })
    })
  },
  loadUserInfo() {
    app.get(getUserInfo, {
      "userId": this.data.id
    }, {
      loading: false
    }).then(res => {
      this.setData({
        user: res
      })
    })
  },
  loadStatistic() {
    app.get(getUserStatistics, {
      "userId": this.data.id
    }, {
      loading: false
    }).then(res => {
      this.setData({
        statistic: res
      })
    })
  },
  navToFollow() {
    app.router("follow", {
      query: {
        "id": this.data.id,
        "nickname": this.data.user.nickname
      }
    });
  },
  navToFans() {
    app.router("fans", {
      query: {
        "id": this.data.id,
        "nickname": this.data.user.nickname
      }
    });
  },
  navToChat() {
    app.router("chat", {
      query: {
        user: JSON.stringify(this.data.user)
      }
    })
  }
})