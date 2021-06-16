const app = getApp();
import {
  editUserInfo
} from "../../http/api"
import {
  upload
} from "../../http/upload"

Page({
  data: {
    noticed: false
  },
  onLoad: function (options) {
    let user = app.getItem('user');
    this.setData({
      user: user,
      avatar: user.avatar
    })
  },
  editAvatar() {
    if (this.data.noticed) {
      this.chooseImage();
    } else {
      let that = this;
      wx.showModal({
        title: '修改头像',
        content: '需花费2枚硬币',
        success(res) {
          if (res.confirm) {
            that.chooseImage();
          }
        }
      })
    }
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          noticed: true,
          avatar: res.tempFilePaths[0]
        })
      }
    });
  },
  save: function (e) {
    var form = e.detail.value;
    if (!form.nickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    var avatar = this.data.avatar;
    if (this.data.user.avatar != avatar) {
      upload(avatar).then(res => {
        form["avatar"] = res;
        this.submit(form);
      })
    } else {
      form["avatar"] = this.data.user.avatar;
      this.submit(form)
    }
  },
  submit(form) {
    app.put(editUserInfo, form, {
      loading: false
    }).then(res => {
      app.setItem('user', res);
      wx.hideLoading();
      app.router("my", {
        openType: 'back'
      })
    })
  },
})