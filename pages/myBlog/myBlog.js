const app = getApp();
import {
  blogPage
} from "../../http/api"

Page({
  data: {},
  onLoad: function (e) {
    let blog = this.selectComponent("#blog");
    blog.init(blogPage, {
      "userId": e.id
    });
  }
})