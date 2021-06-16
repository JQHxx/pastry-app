const app = getApp();
import {
  getCartList,
  addCartItem,
  checkItem
} from "../../http/api"

Page({
  data: {
    cart: [],
    total: 0
  },
  onShow: function () {
    this.loadCartList();
  },
  loadCartList() {
    app.get(getCartList).then(res => {
      this.setData({
        cart: res.list,
        total: res.price
      })
    })
  },
  check(e) {
    let index = e.currentTarget.dataset.index;
    var item = this.data.cart[index];
    app.post(checkItem + "/" + item.product.id, {}, {
      loading: false
    }).then(res => {
      var sum = item.count * item.product.price;
      var price = parseFloat(this.data.total) + (res ? sum : -sum);
      this.setData({
        ['cart[' + index + '].check']: res,
        total: price.toFixed(2)
      })
    })
  },
  increase(e) {
    let index = e.currentTarget.dataset.index;
    var item = this.data.cart[index];
    app.post(addCartItem, {
      "productId": item.product.id
    }, {
      loading: false
    }).then(res => {
      var price = parseFloat(this.data.total) + (item.check ? item.product.price : 0);
      this.setData({
        ['cart[' + index + '].count']: res,
        total: price.toFixed(2)
      })
    })
  },
  decrease(e) {
    let index = e.currentTarget.dataset.index;
    var item = this.data.cart[index];
    if (item.count == 1) {
      var that = this;
      wx.showModal({
        content: '确认删除 ' + item.product.title + ' 吗？',
        success(res) {
          if (res.confirm) {
            that.doDecrease(item, index);
          }
        }
      })
    } else {
      this.doDecrease(item, index);
    }
  },
  doDecrease(item = {}, index) {
    app.post(addCartItem, {
      "productId": item.product.id,
      "add": false
    }, {
      loading: false
    }).then(res => {
      var price = parseFloat(this.data.total) + (item.check ? -item.product.price : 0);
      this.setData({
        ['cart[' + index + '].count']: res,
        total: price.toFixed(2)
      })
      if (res == 0) {
        this.data.cart.splice(index, 1);
        this.setData({
          cart: this.data.cart
        })
      }
    })
  },
  confirm() {
    let total = this.data.total;
    if (!total || total == 0) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none'
      })
    } else {
      app.router('orderConfirm');
    }
  }
})