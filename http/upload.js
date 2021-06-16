import {
  getItem
} from "../utils/store"
import {
  uploadFile,
} from "../http/api"

export function uploadList(fileList = []) {
  return Promise.all(fileList.map((path, index) => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        filePath: path,
        name: "file",
        url: App.server.url + uploadFile,
        header: {
          "Authorization": "Bearer " + getItem("token")
        },
        success: res => {
          let data = JSON.parse(res.data);
          if (data.code == 200) {
            resolve(data.data);
          } else {
            reject(index);
          }
        },
        fail: err => {
          reject(index);
        }
      })
    }).catch(e => {
      return -1;
    })
  }))
}

export function upload(filePath, option = {}) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      filePath: filePath,
      name: "file",
      url: App.server.url + uploadFile,
      header: {
        "Authorization": "Bearer " + getItem("token")
      },
      success: res => {
        let data = JSON.parse(res.data);
        if (data.code == 200) {
          resolve(data.data);
        } else {
          wx.showToast({
            title: data.msg,
            mask: true,
            icon: "none"
          })
        }
      }
    })
  })
}