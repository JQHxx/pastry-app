const app = getApp();
import {
  productPage,
  addCartItem
} from "../../http/api"

Page({
  data: {
    productList: []
  },
  onLoad: function (options) {
    this.loadProduct();
  },
  navToCart() {
    app.router("cart");
  },
  loadProduct() {
    app.get(productPage).then(res => {
      this.setData({
        productList: res.records
      })
    })
  },
  addItem(e) {
    let index = e.currentTarget.dataset.index;
    var product = this.data.productList[index];
    app.post(addCartItem, {
      "productId": product.id,
      "add": true
    }, {
      "loading": false
    }).then(res => {
      wx.showToast({
        title: '已添加 ' + res + '件 ' + product.title,
        icon: 'none'
      })
    })
  }
})