const app = getApp();
import {
  postBlog
} from "../../http/api"
import {
  uploadList
} from "../../http/upload"

Page({
  data: {
    words: 0,
    empty: '',
    imgList: [],
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        index: 2
      })
    }
  },
  ChooseImage() {
    wx.chooseImage({
      count: 9 - this.data.imgList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  count(e) {
    let count = parseInt(e.detail.value.length);
    this.setData({
      words: count,
    })
  },
  submit(e) {
    let content = e.detail.value.content;
    if (!content) {
      wx.showToast({
        title: '请输入文字',
        icon: 'none'
      })
      return;
    }
    uploadList(this.data.imgList).then(res => {
      app.post(postBlog, {
        "content": content,
        "attachmentList": res
      }, {
        loadingTitle: '保存中...'
      }).then(() => {
        wx.showToast({
          title: "发布成功",
          icon: 'none'
        })
        this.setData({
          count: 0,
          empty: '',
          imgList: []
        })
      })
    })
  }
})