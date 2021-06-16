const app = getApp();
import {
  auth
} from "../../http/api"

Page({
  data: {},
  onLoad: function () {
    let token = app.getItem("token");
    if (token) {
      app.router("home", {
        openType: 'switchTab'
      })
    } else {
      this.doLogin();
    }
  },
  onHide() {
    this.setData({
      code: null
    })
  },
  navToHome() {
    app.router("home", {
      openType: 'switchTab'
    })
  },
  doLogin() {
    wx.login({
      success: res => {
        this.setData({
          code: res.code
        })
      }
    })
  },
  authenticate(e) {
    // 这里有个坑，就是wx.login 不能与 wx.getUserProfile 一起调用
    let code = this.data.code;
    if (!code) {
      wx.showToast({
        title: '请求授权中，请稍后重试',
        icon: 'none'
      })
      this.doLogin();
      return;
    }
    wx.getUserProfile({
      desc: '授权登录',
      success: (res) => {
        app.post(auth, {
          "code": code,
          "iv": res.iv,
          "encryptedData": res.encryptedData,
        }, {}).then(res => {
          app.setItem("token", res.token);
          app.setItem("user", res.user);
          app.router("home", {
            openType: 'switchTab'
          })
        })
      },
      fail: err => {
        // 拒绝时 清空code
        this.setData({
          code: null
        })
      }
    })
  }
})