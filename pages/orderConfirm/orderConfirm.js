const app = getApp();
import {
  getOrderConfirmation,
  payOrder
} from "../../http/api"

Page({
  data: {
    confirm: {},
    orderToken: '',
    sign: ''
  },
  onLoad: function (options) {
    this.getConfirmation();
  },
  getConfirmation() {
    app.get(getOrderConfirmation, {}, {
      loading: false
    }).then(res => {
      this.setData({
        orderToken: res.orderToken,
        confirm: res.items,
        sign: res.sign
      })
    })
  },
  pay() {
    var items = this.data.confirm.list;
    var submit = [];
    for (var i in items) {
      submit.push({
        "productId": items[i].product.id,
        "count": items[i].count
      })
    }
    app.post(payOrder, {
      orderToken: this.data.orderToken,
      list: submit,
      price: this.data.confirm.price,
      sign: this.data.sign
    }, {
      loading: false
    }).then(res => {
      console.log(res)
    })
  }
})