const app = getApp();
import {
  followOp
} from "../../http/api"
import {
  getPage,
  loadPre
} from "../../http/page"

Component({
  properties: {},
  data: {
    trigger: false,
    page: 0,
    list: []
  },
  methods: {
    init(id, fans) {
      this.setData({
        list: [],
        id: id,
        fans: fans // 获取粉丝/关注
      })
      this.loadLatest()
    },
    loadLatest() {
      getPage(followOp + '/' + this.data.id, {
        "fans": this.data.fans
      }).then(res => {
        this.setData({
          list: res,
          page: 0,
          trigger: false
        })
      })
    },
    loadPre() {
      loadPre(this.data.list, followOp + this.data.id, {
        page: this.data.page + 1
      }).then(res => {
        if (res.length > this.data.list.length) {
          this.setData({
            list: res,
            page: this.data.page + 1
          })
        }
      })
    },
    follow(e) {
      let index = e.currentTarget.dataset.index;
      let item = this.data.list[index];
      app.post(followOp + '/' + item.user.id, {}, {
        loading: false
      }).then(res => {
        this.setData({
          ['list[' + index + '].follow']: res
        })
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
    }
  }
})