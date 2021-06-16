const app = getApp();

export function getPage(url, param = {}) {
  return new Promise((resolve) => {
    app.get(url, param, {
      loading: false
    }).then(res => {
      resolve(res.records);
    })
  })
}

export function loadPre(list = [], url, param = {}) {
  let {
    page = false,
  } = param;
  // 这里有个bug, param["limit"]会带入limit信息，导致下一次查询错误
  // 临时用拷贝的方式解决
  let tmp = {}
  Object.assign(tmp = {}, param)
  return new Promise((resolve) => {
    if (!page) {
      // 通过limit分页
      tmp["limit"] = list[list.length - 1].id;
    }
    app.get(url, tmp, {
      loading: false
    }).then(res => {
      let tmp = list;
      if (res.records.length != 0) {
        tmp = list.concat(res.records);
      }
      resolve(tmp);
    })
  })
}