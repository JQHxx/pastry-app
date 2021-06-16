// 授权
export const auth = "/api/pastry/portal/user/authenticate";

// 上传图片
export const uploadFile = "/api/pastry/upload/file";

// 获取个人信息
export const getUserInfo = "/api/pastry/portal/user/userInfo"
// 获取个人统计信息
export const getUserStatistics = "/api/pastry/portal/user/statistics"
// 修改个人信息
export const editUserInfo = "/api/pastry/portal/user/edit"

// 关注 相关操作
export const followOp = "/api/pastry/portal/follow"

// 发布动态
export const postBlog = "/api/pastry/portal/blog/post";

// 获取排行榜
export const rankList = "/api/pastry/portal/rank/list";

// 获取博客页
export const blogPage = "/api/pastry/portal/blog/page";
// 删除博客
export const deleteBlog = "/api/pastry/portal/blog/delete"
// 点赞博客
export const likeBlog = "/api/pastry/portal/blog/like"
// 投币
export const coinBlog = "/api/pastry/portal/blog/coin"

// 追加评论
export const comment = "/api/pastry/portal/comment/post"
// 获取评论页
export const commentPage = "/api/pastry/portal/comment/page"
// 删除评论
export const deleteComment = "/api/pastry/portal/comment/delete"

// 获取商品页
export const productPage = "/api/pastry/pay/product/page"
// 添加到购物车
export const addCartItem = "/api/pastry/pay/cart/add";
// 获取购物车列表
export const getCartList = "/api/pastry/pay/cart/list";
// 选中购物车商品
export const checkItem = "/api/pastry/pay/cart/check";
// 确认订单
export const getOrderConfirmation = "/api/pastry/pay/order/confirm";
// 发起支付
export const payOrder = "/api/pastry/pay/order/pay";
// 历史订单
export const getOrderList = "/api/pastry/pay/order/list";
// 继续支付
export const continueToPay = "/api/pastry/pay/order/continueToPay";
// 取消订单
export const cancelOrder = "/api/pastry/pay/order/cancel";

