const app = getApp();
import {
  commentPage,
  comment,
  deleteComment
} from "../../http/api"
import {
  getPage,
  loadPre
} from "../../http/page"
Page({
  data: {
    // comment
    comment: {},
    list: [],

    trigger: false,
    focus: false,
    InputBottom: 0,

    empty: '',
    words: 0,

    receiver: {}
  },
  onLoad(e) {
    let comment = JSON.parse(e.comment);
    this.setData({
      comment: comment,
      receiver: comment.replier
    })
    this.loadLatest();
  },
  loadLatest() {
    getPage(commentPage, {
      "parentId": this.data.comment.id,
      "queryChild": true
    }).then(res => {
      this.setData({
        list: res,
        trigger: false,
      })
    })
  },
  loadPre() {
    loadPre(this.data.list, commentPage, {
      "parentId": this.data.comment.id,
      "queryChild": true
    }).then(res => {
      this.setData({
        commentList: res
      })
    })
  },
  // reply
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0,
      focus: false,
      receiver: this.data.comment.replier //重置为父级评论对象
    })
  },
  count(e) { //计数
    let count = parseInt(e.detail.value.length);
    this.setData({
      words: count,
    })
  },
  reply(e) {
    let content = e.detail.value;
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return;
    }
    app.post(comment, {
      "parentId": this.data.comment.id,
      "receiverId": this.data.receiver.id,
      "content": content,
      "type": false
    }, {
      "loading": false
    }).then(res => {
      wx.showToast({
        title: '评论成功',
        icon: 'none'
      })
      let list = this.data.list;
      list.unshift(res);
      this.setData({
        list: list,
        content: '',
        empty: '',
        count: 0
      })
    })
  },
  setTarget(e) {
    let index = e.currentTarget.dataset.index;
    let subComment = this.data.list[index];
    this.setData({
      focus: true,
      receiver: subComment.replier
    })
  },
  navToOther(e) {
    let id = e.currentTarget.dataset.id;
    if (id == app.getItem('user').id) {
      app.router("my", {
        openType: "switchTab"
      })
    } else {
      app.router("other", {
        query: {
          id: id
        }
      })
    }
  },
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  deleteComment(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let list = that.data.list;
    if (list[index].replier.id == app.getItem('user').id) {
      wx.showActionSheet({
        itemList: ['删除'],
        success: res => {
          app.get(deleteComment + '/' + list[index].id, {}, {
            method: 'delete'
          }).then(res => {
            list.splice(index, 1);
            that.setData({
              list: list
            })
          })
        },
        fail: err => {}
      })
    }
  },
})