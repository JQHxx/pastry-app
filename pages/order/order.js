const app = getApp();
import {
  getOrderList,
  continueToPay,
  cancelOrder
} from "../../http/api"
import {
  getPage,
  loadPre
} from "../../http/page"

Page({
  data: {
    list: [],
    trigger: false
  },
  onLoad: function (options) {
    this.loadLatest();
  },
  loadLatest: function () {
    getPage(getOrderList).then(res => {
      console.log(res)
      this.setData({
        list: res,
        trigger: false
      })
    })
  },
  loadPre: function () {
    loadPre(this.data.list, getOrderList).then(res => {
      this.setData({
        list: res
      })
    })
  },
  pay(e) {
    let index = e.currentTarget.dataset.index;
    app.get(continueToPay, {
      "orderSn": this.data.list[index].orderSn
    }, {
      loading: false
    }).then(res => {
      // 发起支付
      console.log(res);
    })
  },
  cancel(e) {
    let index = e.currentTarget.dataset.index;
    let orderSn = this.data.list[index].orderSn;
    app.post(cancelOrder + '/' + orderSn, {}, {
      loading: false
    }).then(res => {
      wx.showToast({
        title: '订单已取消',
        icon: 'none'
      })
      if(res == 'SUCCESS'){
        this.setData({
          ['list[' + index + '].status']: "CANCELED",
        })
      }
    })
  }
})