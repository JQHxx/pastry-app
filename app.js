import {
  fetch
} from "./http/request";
import {
  push
} from "./utils/router"
import {
  getItem,
  setItem
} from "./utils/store"
import {
  Dev
} from "./env/host";

App.server = Dev;
App.version = "v1.0.0";

App({
  getItem,
  setItem,
  router: push,
  get: fetch,
  post: (url, data, option) => {
    option.method = "post";
    return fetch(url, data, option);
  },
  put: (url, data, option) => {
    option.method = "put";
    return fetch(url, data, option);
  },
  onLaunch() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  globalData: {}
})