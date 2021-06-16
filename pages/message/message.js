const app = getApp();
import {
  getUserInfo
} from "../../http/api"

Page({
  data: {
    trigger: false,
    chatSnapshot: []
  },
  onLoad: function () {
    // 加载聊天快照
    this.loadChatSnapshot();
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        index: 3
      })
    }
  },
  loadChatSnapshot: function () {
    let list = app.getItem("chat-snapshot") || [];
    Promise.all(list.map((item) => {
      return new Promise(resolve => {
        if (!item.nickname || !item.avatar) {
          this.getUserInfo(item.id).then(res => {
            // 补充头像、名称
            item["nickname"] = res.nickname;
            item["avatar"] = res.avatar;
            resolve(item);
          })
        } else {
          resolve(item)
        }
      })
    })).then(list => {
      this.setData({
        trigger: false,
        chatSnapshot: list
      })
    })
  },
  getUserInfo(id) {
    return new Promise(resolve => {
      let key = 'chat-user';
      if (!app.getItem(key)) {
        app.setItem(key, {});
      }
      let user = app.getItem(id, key);
      if (!user) {
        app.get(getUserInfo, {
          userId: id,
          detail: false
        }, {
          loading: false
        }).then(res => {
          // 保存到本地缓存
          app.setItem(id, res, key);
          resolve(res);
        })
      } else {
        resolve(user);
      }
    })
  },
  navToChat(e) {
    if (this.endTime - this.startTime < 350) {
      let id = e.currentTarget.dataset.id;
      let user = app.getItem(id, 'chat-user');
      app.router("chat", {
        query: {
          user: JSON.stringify(user)
        }
      })
    }
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
  // 长按删除
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  deleteChat(e) {
    let that = this;
    let snapshot = that.data.chatSnapshot;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        that.clearLocalStorage(id)
        snapshot.splice(index, 1);
        that.setData({
          chatSnapshot: snapshot
        })
      },
      fail: err => {}
    })
  },
  clearLocalStorage(id) {
    // 删除快照
    let snapshot = app.getItem('chat-snapshot');
    for (var i in snapshot) {
      if (snapshot[i].id == id) {
        snapshot.splice(i, 1);
        app.setItem('chat-snapshot', snapshot);
        break;
      }
    }
    // 删除聊天历史
    let chatHistory = app.getItem('chat-history');
    delete chatHistory[id];
    app.setItem('chat-history', chatHistory);
    // 删除对象信息
    let chatUser = app.getItem('chat-user');
    delete chatUser[id];
    app.setItem('chat-user', chatUser);
  }
})