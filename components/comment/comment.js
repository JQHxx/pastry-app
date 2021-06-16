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

Component({
  properties: {

  },
  data: {
    list: [],
    trigger: false,
    show: false, // 用于显示 评论模态框
    focus: false, // 输入框是否自动聚焦
    InputBottom: 0, // 输入框底部位置

    // 输入框 初始数据
    empty: '',
    words: 0,

    // 主回复对象
    blogger: {},
    blogId: null,

    // 临时回复对象
    pos: null,
    receiver: {},
    parentId: null,
  },
  methods: {
    showComment(parentId, receiver = {}) {
      this.setData({
        list: [],
        show: true,
        trigger: false,
        blogId: parentId,
        blogger: receiver,
        parentId: parentId,
        receiver: receiver
      })
      this.loadLatest()
      // 主页隐藏底部tabbar
      if (this.getTabBar()) {
        this.getTabBar().setData({
          show: false
        })
      }
    },
    hideComment() {
      this.setData({
        show: false
      })
      // 显示底部tabbar
      if (this.getTabBar()) {
        this.getTabBar().setData({
          show: true
        })
      }
    },
    loadLatest() {
      getPage(commentPage, {
        "parentId": this.data.parentId
      }).then(res => {
        this.setData({
          list: res,
          trigger: false,
        })
      })
    },
    loadPre() {
      loadPre(this.data.list, commentPage, {
        "parentId": this.data.parentId
      }).then(res => {
        this.setData({
          commentList: res
        })
      })
    },
    // 设置评论对象
    setTarget(e) {
      if (this.endTime - this.startTime < 350) {
        let index = e.currentTarget.dataset.index;
        let comment = this.data.list[index];
        this.setData({
          pos: index,
          parentId: comment.id,
          receiver: comment.replier,
          focus: true // 显示输入框
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
    // 回复
    reply(e) {
      let content = e.detail.value;
      if (!content) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return;
      }
      // true: 评论博客，否则就是评论评论
      let type = (this.data.parentId == this.data.blogId)
      app.post(comment, {
        "parentId": this.data.parentId,
        "receiverId": this.data.receiver.id,
        "content": content,
        "type": type
      }, {
        "loading": false
      }).then(res => {
        wx.showToast({
          title: '评论成功',
          icon: 'none'
        })
        let list = this.data.list;
        if (type) {
          // 将评论信息置顶
          list.unshift(res)
        } else {
          let pos = this.data.pos;
          this.setData({
            ['list[' + pos + '].commentCount']: list[pos].commentCount + 1
          })
        }
        this.setData({
          list: list,
          content: '',
          empty: '',
          count: 0
        })
      })
    },
    // 导航到评论子页面，带上必要的信息
    navigate(e) {
      let index = e.currentTarget.dataset.index;
      let comment = this.data.list[index];
      app.router("subComment", {
        query: {
          comment: JSON.stringify(comment),
        }
      });
    },
    // 将输入框显示在键盘上方
    InputFocus(e) {
      this.setData({
        InputBottom: e.detail.height
      })
    },
    InputBlur(e) {
      this.setData({
        InputBottom: 0,
        focus: false,
        parentId: this.data.blogId, // 重置为blogId
        receiver: this.data.blogger,
        index: null
      })
    },
    count(e) { //计数
      let count = parseInt(e.detail.value.length);
      this.setData({
        words: count,
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
  },
})