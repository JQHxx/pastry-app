import {
  getSystemInfo
} from "../utils/util"
import {
  setItem,
  getItem
} from "../utils/store"
import {
  push
} from "../utils/router"

const sys_info = getSystemInfo()
const header = {
  "app": "pastry",
  "version": App.version,
  "model": sys_info.model,
  "os": sys_info.system,
  "screen": sys_info.screenWidth + "*" + sys_info.statusBarHeight,
  "channel": "wx-miniapp"
}

export function fetch(url, data = {}, option = {}) {
  let {
    loading = true, loadingTitle = "加载中...", toast = true, method = "get"
  } = option
  return new Promise((resolve, reject) => {
    if (loading) {
      wx.showLoading({
        title: loadingTitle,
        mask: true
      })
    }
    wx.request({
      url: App.server.url + url,
      data,
      method,
      header: {
        "client": JSON.stringify(header),
        "Authorization": "Bearer " + getItem("token")
      },
      success: function (res) {
        let data = res.data
        if (data.code == 200) {
          if (loading) {
            wx.hideLoading()
          }
          resolve(data.data)
        } else if (data.code == 401) {
          setItem("token", '');
          push("auth");
        } else {
          if (toast) {
            wx.showToast({
              title: data.msg,
              mask: true,
              icon: "none"
            })
          } else {
            wx.hideLoading()
          }
        }
      },
      fail: function (err) {
        let msg = err.errMsg
        if (msg == "request:fail ") {
          msg = "请求失败"
        }
        if (msg == 'request:fail timeout') {
          msg = '请求超时，请稍后处理'
        }
        reject(err)
      }
    })
  })
}