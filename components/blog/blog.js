const app = getApp();
import {
  getPage,
  loadPre
} from "../../http/page"
import {
  deleteBlog,
  likeBlog,
  coinBlog
} from "../../http/api"

Component({
  properties: {
    height: {
      type: Number,
      value: 90
    },
    personal: {
      type: Number,
      value: 0 // 0主页，1个人，2他人 
    },
    rank: {
      type: Boolean,
      value: false
    }
  },
  data: {
    url: '',
    param: {},
    list: [],
  },
  methods: {
    // 设置请求路径/参数，用于主页、个人博客页
    init(url, param) {
      this.setData({
        list: [],
        url: url,
        param: param
      })
      this.loadLatest();
    },
    loadLatest: function () {
      getPage(this.data.url, this.data.param).then(res => {
        this.setData({
          list: res || [],
          trigger: false
        })
      })
    },
    loadPre: function () {
      if (this.data.rank) {
        // 热门不支持加载前一页
        return;
      }
      loadPre(this.data.list, this.data.url, this.data.param).then(res => {
        this.setData({
          list: res
        })
      })
    },
    giveALike(e) {
      let index = e.currentTarget.dataset.index;
      let blog = this.data.list[index];
      app.post(likeBlog + '/' + blog.id, {}, {
        loading: false
      }).then(res => {
        this.setData({
          ['list[' + index + '].statistic.likeCount']: blog.statistic.likeCount + (res ? 1 : -1),
          ['list[' + index + '].like']: res
        })
      })
    },
    giveACoin(e) {
      let that = this;
      wx.showModal({
        title: '确认投币吗?',
        content: '将花费一枚硬币',
        success(res) {
          if (res.confirm) {
            let index = e.currentTarget.dataset.index;
            let blog = that.data.list[index];
            app.post(coinBlog + '/' + blog.id, {}, {
              loading: false
            }).then(res => {
              that.setData({
                ['list[' + index + '].statistic.coinCount']: blog.statistic.coinCount + 1,
              })
            })
          }
        }
      })
    },
    delete(e) {
      let that = this;
      wx.showModal({
        content: '确认删除该动态吗?',
        success(res) {
          if (res.confirm) {
            let index = e.currentTarget.dataset.index;
            let list = that.data.list;
            app.get(deleteBlog + '/' + list[index].id, {}, {
              method: 'delete'
            }).then(res => {
              list.splice(index, 1);
              that.setData({
                list: list
              })
            })
          }
        }
      })
    },
    showComment(e) {
      let index = e.currentTarget.dataset.index;
      let blog = this.data.list[index];
      // 显示评论模态框
      let commentModal = this.selectComponent("#comment");
      commentModal.showComment(blog.id, blog.user);
    },
    navToOther(e) {
      let id = e.currentTarget.dataset.id;
      if (id == app.getItem('user').id) {
        app.router("my", {
          openType: "switchTab"
        })
      } else {
        // 只有主页能跳转到个人页
        if (this.data.personal != 0) {
          return;
        }
        app.router("other", {
          query: {
            id: id
          }
        })
      }
    },
    viewImage(e) {
      let index = e.currentTarget.dataset.index;
      let blog = this.data.list[index];
      wx.previewImage({
        urls: JSON.parse(blog.attachments),
        current: e.currentTarget.dataset.url
      })
    }
  }
})