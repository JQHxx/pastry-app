export function setItem(key, value, map_key) {
  if (map_key) {
    let map = this.getItem(map_key);
    if (map) {
      map[key] = value;
      wx.setStorageSync(map_key, map);
    }
  } else {
    wx.setStorageSync(key, value);
  }
}

export function getItem(key, map_key) {
  if (map_key) {
    let map = this.getItem(map_key);
    if (map) {
      return map[key];
    }
    return null;
  } else {
    return wx.getStorageSync(key);
  }
}