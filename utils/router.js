const router = {
  "auth": "/pages/auth/auth",
  "index": "/pages/index/index",
  "home": "/pages/home/home",
  "post": "/pages/post/post",
  "discovery": "/pages/discovery/discovery",
  "subComment": "/pages/subComment/subComment",
  "chat": "/pages/chat/chat",
  "cart": "/pages/cart/cart",
  "orderConfirm": "/pages/orderConfirm/orderConfirm",
  "my": "/pages/my/my",
  "myBlog": "/pages/myBlog/myBlog",
  "fans": "/pages/fans/fans",
  "other": "/pages/other/other",
  "follow": "/pages/follow/follow",
  "profile": "/pages/profile/profile"
}

export function push(path, option = {}) {
  if (typeof path === 'string') {
    option.path = path;
  } else {
    option = path;
  }

  let url = router[option.path];
  let {
    query = {}, openType
  } = option;
  let params = parse(query);
  if (params) {
    url += "?" + params;
  }
  navigate(url, openType);
}

function parse(query) {
  let arr = [];
  for (let key in query) {
    arr.push(key + "=" + query[key]);
  }
  return arr.join("&");
}

function navigate(url, openType) {
  let wrapper = {
    url
  };
  if (openType === 'redirect') {
    wx.redirectTo(wrapper);
  } else if (openType === 'reLaunch') {
    wx.reLaunch(wrapper);
  } else if (openType === 'back') {
    wx.navigateBack({
      delta: 1,
    });
  } else if (openType === 'switchTab') {
    wx.switchTab(wrapper);
  } else {
    wx.navigateTo(wrapper);
  }
}