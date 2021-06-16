const app = getApp();
import {
  websocket
} from "../../http/websocket"
import {
  formatTime
} from "../../utils/util"

Page({
  data: {
    trigger: false,
    friend: {},
    list: [],

    focus: false,
    words: 0,
    empty: "",
    InputBottom: 0
  },
  startClock: function () {
    var that = this;
    that.data.clock = setInterval(
      function () {
        that.loadHistory();
      }, 800);
  },
  onLoad(e) {
    let friend = JSON.parse(e.user);
    // 更新对象信息
    app.setItem(friend.id, friend, 'chat-user')
    this.setData({
      user: app.getItem('user'),
      friend: friend,
      list: app.getItem(friend.id, "chat-history")
    })
    websocket.init();
    this.startClock();
  },
  onUnload() {
    clearInterval(this.data.clock);
    websocket.close();
  },
  // input
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0,
      focus: false
    })
  },
  count(e) { //计数
    let count = parseInt(e.detail.value.length);
    this.setData({
      words: count,
    })
  },
  loadHistory() {
    let id = this.data.friend.id;
    this.setData({
      list: app.getItem(id, "chat-history") || [],
      trigger: false
    })
    // clear unread
    websocket.clearUnread(id);
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
    websocket.sendMessage({
      "senderId": this.data.user.id,
      "receiverId": this.data.friend.id,
      "content": content,
      "event": websocket.CHAT,
    }).then((res) => {
      // 发送成功，保存聊天信息，注意将senderId设置为对方，type设置为1
      websocket.saveChatEntity({
        "senderId": this.data.friend.id,
        "receiverId": app.getItem("user").id,
        "content": content,
        "date": formatTime(new Date())
      }, 1);
      this.setData({
        content: '',
        empty: '',
        count: 0
      })
      setTimeout(() => {
        this.loadHistory();
      }, 500)
    }).catch(err => {
      let title = '';
      if (err == "send:fail") {
        title = "发送失败!"
      } else if (err == "send:fail closed") {
        title = "连接初始化中，请稍后重试"
        websocket.init();
      } else {
        title = "系统故障!"
      }
      wx.showToast({
        title: title,
        icon: 'none'
      })
    })
  },
})