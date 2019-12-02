
import Vue from 'vue'
import http from '@/utils/http'

/**
 *
 * 同功能，在不同环境时请求接口路径不同时，分两个对象存储路径
 */

const url = {
  VUE_APP_BASE_API: {
    userInfo: '/sys/user/info',
    userSetPassword: '/sys/user/setPassword',
  },
  VUE_APP_SHOP_API: {
    userInfo: '/merchant/info/detail',
    userSetPassword: '/merchant/info/setPassword',

  }
}

/**
 * 第三个参数，需要post请求，formData传参方式时，传入该字符串。
 */

/**
 * 首页
 */

// 用户相关数据统计
export function userCounter(data) {
  return http.post('/sys/home/userCounter', data, 'formData')
}

// 产品相关数据统计
export function productCounter(data) {
  return http.post('/sys/home/productCounter', data, 'formData')
}

// 订单相关数据统计
export function orderCounter(data) {
  return http.post('/sys/home/orderCounter', data, 'formData')
}

// 发货订单相关统计
export function deliveryCounter(data) {
  return http.post('/sys/home/deliveryCounter', data, 'formData')
}





// 获取成员列表
export function userList(data) {
  return http.post('/sys/user/list', data, 'formData')
}

// 成员禁用启用
export function userSetStatus(data) {
  return http.post('/sys/user/setStatus', data, 'formData')
}

// 添加成员
export function userAdd(data) {
  return http.post('/sys/user/add', data, 'formData')
}

// 编辑成员
export function userUpdate(data) {
  return http.post('/sys/user/update', data, 'formData')
}

// 删除成员
export function userDelete(data) {
  return http.post('/sys/user/delete', data, 'formData')
}

// 系统角色列表
export function roleList(data) {
  return http.post('/sys/role/list', data, 'formData')
}

// 角色权限列表
export function getUsableList(data) {
  return http.post('/sys/permission/usableList', data, 'formData')
}

// 修改权限
export function userAuthorize(data) {
  return http.post('/sys/permission/authorize', data, 'formData')
}

// 获取账号信息
export function userInfo(data) {
  return http.post(url[Vue.prototype.$base].userInfo, data, 'formData')
}

// 修改密码
export function userSetPassword(data) {
  return http.post(url[Vue.prototype.$base].userSetPassword, data, 'formData')
}

// 修改头像
export function userSetHeadPath(data) {
  return http.post('/sys/user/setHeadPath', data, 'formData')
}

// 操作日志
export function userLog(data) {
  return http.post('/sys/user/logs', data, 'formData')
}

// 通知管理
export function noticeList(data) {
  return http.post('/system/notice/search', data, 'formData')
}

// 通知管理数量
export function noticeCounter(data) {
  return http.post('/system/notice/counter', data, 'formData')
}

// 通知管理上下架
export function noticeSetStatus(data) {
  return http.post('/system/notice/setStatus', data, 'formData')
}

// 添加通知
export function addRelease(data) {
  return http.post('/system/notice/release', data, 'formData')
}








// 获取用户权限列表
export function userPermission(data) {
  return http.post('/sys/permission/userPermission', data, 'formData')
}

// 快递公司信息
export function channelList(data) {
  return http.post('/gifts/delivery/channel/list', data, 'formData')
}


/**
 * 商品列表
 */
// 获取商品列表
export function produckList(data) {
  return http.post('/product/info/search', data, 'formData')
}

// 商品查询统计数据
export function produckCounter(data) {
  return http.post('/product/info/counter', data, 'formData')
}

// 商品分类查询
export function produckTree(data) {
  return http.post('/product/category/tree', data, 'formData')
}

// 标签场景查询接口
export function produckTabel(data) {
  return http.post('/product/label/list', data, 'formData')
}

// 商品上下架
export function produckSetStatus(data) {
  return http.post('/product/info/setStatus', data, 'formData')
}

// 商品上下架-多选
export function produckBatchUp(data) {
  return http.post('/product/info/batchUpDown', data, 'formData')
}

// 商品推荐
export function produckRecommend(data) {
  return http.post('/product/recommend/recommend', data, 'formData')
}

// 商品取消推荐
export function produckUnRecommend(data) {
  return http.post('/product/recommend/unRecommend', data, 'formData')
}

// 商品修改排序
export function produckSetCoefficient(data) {
  return http.post('/product/info/setCoefficient', data, 'formData')
}



/**
 * 商品发布
 */

// 保存商品基本属性
export function produckInfoRelease(data) {
  return http.post('/product/info/release', data, 'formData')
}

// 修改商品基本属性
export function produckInfoUpdate(data) {
  return http.post('/product/info/update', data, 'formData')
}

// 获取商品基本属性
export function produckInfoDetails(data) {
  return http.post('/product/info/details', data, 'formData')
}

// 发布商品
export function produckBatchAdd(data) {
  return http.post('/product/details/batchAdd', data, 'formData')
}



/**
 * 商品分类
 */

// 商品分类列表
export function produckCategoryList(data) {
  return http.post('/product/category/list', data, 'formData')
}

// 送礼场景列表
export function produckLabelList(data) {
  return http.post('/product/label/list', data, 'formData')
}

// 新增分类属性
export function produckAddAttribute(data) {
  return http.post('/product/attribute/name/add', data, 'formData')
}

// 编辑分类属性
export function produckEditAttribute(data) {
  return http.post('/product/attribute/name/edit', data, 'formData')
}

// 查看全部属性
export function produckAllAttribute(data) {
  return http.post('/product/attribute/name/attributes', data, 'formData')
}

// 删除属性
export function produckDelAttribute(data) {
  return http.post('/product/attribute/name/delete', data, 'formData')
}

// 修改分类排序
export function setCoefficient(data) {
  return http.post('/product/category/setCoefficient', data, 'formData')
}

// 商品标签
export function productLabel(data) {
  return http.post('/product/label/search', data, 'formData')
}

// 商品标签数量
export function productLabelCounter(data) {
  return http.post('/product/label/counter', data, 'formData')
}

// 新增商品标签
export function productLabelSave(data) {
  return http.post('/product/label/save', data, 'formData')
}

// 商品标签删除
export function productLabelDelete(data) {
  return http.post('/product/label/delete', data, 'formData')
}

// 商品标签详情
export function productLabelDetail(data) {
  return http.post('/product/label/detail', data, 'formData')
}

// 商品标签详情
export function labelShowHomePage(data) {
  return http.post('/product/label/showHomePage', data, 'formData')
}

// 新增场景
export function productScenelSave(data) {
  return http.post('/product/scene/save', data, 'formData')
}

// 场景列表
export function productScenelList(data) {
  return http.post('/product/scene/list', data, 'formData')
}

// 删除场景
export function productScenelDel(data) {
  return http.post('/product/scene/delete', data, 'formData')
}

// 场景排序
export function productScenelSort(data) {
  return http.post('/product/scene/sort', data, 'formData')
}

// 场景详情
export function productScenelDetail(data) {
  return http.post('/product/scene/detail', data, 'formData')
}

// 场景编辑
export function productScenelEdit(data) {
  return http.post('/product/scene/edit', data, 'formData')
}

// 场景编辑
export function sceneShowHomePage(data) {
  return http.post('/product/scene/showHomePage', data, 'formData')
}



/**
 * 订单
 */

// 订单列表
export function orderList(data) {
  return http.post('/order/item/search', data, 'formData')
}

// 订单详情
export function orderDetails(data) {
  return http.post('/order/info/details', data, 'formData')
}

// 提货订单列表
export function orderGifts(data) {
  return http.post('/gifts/delivery/item/search', data, 'formData')
}

// 提货订单详情
export function orderGiftsDetail(data) {
  return http.post('/gifts/delivery/details', data, 'formData')
}

// 提货订单数量
export function orderGiftsCounter(data) {
  return http.post('/gifts/delivery/item/counter', data, 'formData')
}

// 发货
export function postDelivery(data) {
  return http.post('/gifts/delivery/item/post', data, 'formData')
}

// 订单物流信息
export function deliveryQuery(data) {
  return http.post('/gifts/delivery/item/query', data, 'formData')
}

// 供货商列表
export function merchantList(data) {
  return http.post('/merchant/info/search', data, 'formData')
}

// 供货商列表
export function merchantCreate(data) {
  return http.post('/merchant/info/create', data, 'formData')
}

// 供货商详细信息
export function companyDetail(data) {
  return http.post('/merchant/info/detail', data, 'formData')
}

// 编辑供货商
export function companyEdit(data) {
  return http.post('/merchant/info/edit', data, 'formData')
}


/**
 * 卡券
 */


// 礼卡充值
export function companyList(data) {
  return http.post('/company/recharge/record/search', data, 'formData')
}

// 企业信息查询
export function companyDetails(data) {
  return http.post('/company/info/details', data, 'formData')
}

// 积分充值
export function companyRecharge(data) {
  return http.post('/company/account/recharge', data, 'formData')
}

// 实卡管理列表
export function companyBatchList(data) {
  return http.post('/coupon/batch/search', data, 'formData')
}

// 生成实卡
export function companyGenerate(data) {
  return http.post('/coupon/batch/generate', data, 'formData')
}

// 生成详情
export function companyBatchDetails(data) {
  return http.post('/coupon/batch/details', data, 'formData')
}

// 生成详情列表
export function companyInfoList(data) {
  return http.post('/coupon/info/search', data, 'formData')
}

// 查询礼卡可用号段
export function batchBindPrepare(data) {
  return http.post('/coupon/info/batchBindPrepare', data, 'formData')
}

// 绑定激活
export function batchBind(data) {
  return http.post('/coupon/info/batchBind', data, 'formData')
}

// 礼卡失效
export function disabled(data) {
  return http.post('/coupon/info/disabled', data, 'formData')
}

// 礼卡失效
export function couponDetail(data) {
  return http.post('/order/info/coupon/detail', data, 'formData')
}

// 获取绑定记录
export function getHistorys(data) {
  return http.post('/coupon/bind/record/search', data, 'formData')
}

// 获取绑定商品
export function getHistoryDetail(data) {
  return http.post('/coupon/bind/record/detail', data, 'formData')
}

/**
 *文章
 */
// 发布文章
export function postArticleRelease(data) {
  return http.post('/article/info/release', data, 'formData')
}
//编辑/修改文章
export function articleEdit(data){
  return http.post('/article/info/edit', data, 'formData')
}
// 文章列表
export function articleList(data) {
  return http.post('/article/info/articleList', data, 'formData')
}
//删除文章
export function articleDel(data) {
  return http.post('/article/info/del', data, 'formData')
}
//文章详情
export function articleDetail(data){
  return http.post('/article/info/detail', data, 'formData')
}





// 非固定请求路径
export function postApi(data,url) {
  return http.post(url, data, 'formData')
}







/**
 * 商户
 */

