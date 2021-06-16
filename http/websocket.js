const app = getApp();

export const websocket = {
  socket: null,

  // websocket 连接状态
  CLOSED: 3,
  CLOSING: 2,
  OPEN: 1,
  CONNECTING: 0,

  // 自定义 请求事件
  KEEPLIVE: 4,
  FETCH: 3,
  SIGN: 2,
  CHAT: 1,
  CONNECT: 0,

  init: function () {
    // 确保上一个连接关闭
    if (this.socket != null && this.socket != undefined && this.socket.readyState != this.CLOSED) {
      return;
    }
    this.socket = wx.connectSocket({
      url: App.server.ws,
    })
    this.socket.onOpen(() => {
      this.wsopen();
    })
    this.socket.onMessage(res => {
      this.wsmessage(res);
    })
  },
  close: function () {
    wx.onSocketOpen(function () {
      wx.closeSocket()
    })
  },
  sendMessage: function (msg) {
    return new Promise((resolve, reject) => {
      // 确保当前连接开启
      if (this.socket != null && this.socket != undefined && this.socket.readyState == this.OPEN) {
        this.socket.send({
          data: JSON.stringify(msg),
          success: (res) => {
            resolve();
          },
          fail: () => {
            reject("send:fail");
          }
        })
      } else {
        reject("send:fail closed");
      }
    })
  },
  // 开启websocket
  wsopen() {
    this.sendMessage({
      event: this.CONNECT,
      senderId: app.getItem("user").id
    }).then(() => {
      // 连上时自动获取未签收消息
      this.fetchUnsignedMessage();
    }).catch(err => {
      // console.log(err + " -> 连接失败")
    })
    // 定时发送心跳
    this.clock = setInterval(() => {
      this.keeplive();
    }, 2000)
  },
  // 发送心跳
  keeplive: function () {
    this.sendMessage({
      event: this.KEEPLIVE,
      senderId: app.getItem("user").id
    }).catch(err => {
      // console.log(err + " -> 心跳中断");
    })
  },
  // 获取未签收消息
  fetchUnsignedMessage: function () {
    this.sendMessage({
      event: this.FETCH,
      senderId: app.getItem("user").id
    }).catch(err => {
      // console.log(err + " -> 获取未签收消息失败");
    })
  },
  // 统一处理服务端响应
  wsmessage: function (e) {
    let unsignedIds = [];
    let list = JSON.parse(e.data);
    for (var i in list) {
      unsignedIds.push(list[i].messageId);
      // 保存聊天记录
      this.saveChatEntity(list[i], 2);
    }
    // 签收已收到的消息
    if (unsignedIds.length > 0) {
      this.sign(unsignedIds);
    }
  },
  // 批量签收消息
  sign: function (unsignedIds) {
    this.sendMessage({
      event: this.SIGN,
      senderId: app.getItem("user").id,
      unsignedIds: unsignedIds
    }).catch(err => {
      //console.log("未签收" + unsignedIds);
    })
  },

  // entity: messageId,senderId,receiverId,content,date
  // type: 1：自己, 2:对方
  saveChatEntity: function (entity, type) {
    // 保存聊天历史
    let key = "chat-history";
    if (!app.getItem(key)) {
      app.setItem(key, {});
    }
    // 以senderId作为key, 这里的senderId应为对方Id
    let history = app.getItem(entity.senderId, key) || [];
    entity["type"] = type;
    history.push(entity);
    // 保存最近20条记录
    if (history.length > 20) {
      history = history.slice(1);
    }
    app.setItem(entity.senderId, history, key);
    // 保存聊天快照
    this.saveChatSnapshot(entity)
  },

  // snapshot: id,content,date,unread; id是对方ID
  saveChatSnapshot: function (entity) {
    let key = "chat-snapshot";
    let snapshot = app.getItem(key) || [];
    let found = false;
    for (var i in snapshot) {
      if (snapshot[i].id == entity.senderId) {
        // 更新内容 & 未读+1
        snapshot[i].content = entity.content;
        snapshot[i].date = entity.date;
        snapshot[i].unread += 1;
        found = true;
        break;
      }
    }
    if (!found) {
      // 新消息置顶
      let tmp = {
        "id": entity.senderId,
        "content": entity.content,
        "date": entity.date,
        "unread": 1
      }
      snapshot.unshift(tmp);
    }
    app.setItem(key, snapshot);
  },

  // 清空未读
  clearUnread: function (id) {
    let key = "chat-snapshot";
    let snapshot = app.getItem(key);
    for (var i in snapshot) {
      if (snapshot[i].id == id) {
        snapshot[i].unread = 0;
        break;
      }
    }
    app.setItem(key, snapshot);
  }
}