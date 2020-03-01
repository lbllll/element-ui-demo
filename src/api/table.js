
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
};

/**
 * 第三个参数，需要post请求，formData传参方式时，传入该字符串。
 */

/**
 * 首页
 */

// 系统用户相关数据统计
export function userList(data) {
  return http.get('/api/sys/users/list', data, 'formData')
}
export function userAdd(data) {
  return http.post('/api/sys/users/info', data, 'formData')
}
export function userUpdate(data) {
  return http.put('/api/sys/users/info', data, 'formData')
}
export function userDelete(data) {
  return http.delete('/api/sys/users/info?userId='+data, 'formData')
}
export function userInfo(data) {
  return http.get('/api/sys/users/info', data, 'formData')
}
export function userState(data) {
  return http.put('/api/sys/users/state', data, 'formData')
}
export function userInfoAndRoles(data) {
  return http.get('/api/sys/users/info/roles', data, 'formData')
}
//角色相关
export function roleInfo(data) {
  return http.get('/api/sys/roles/info', data, 'formData')
}
export function roleAdd(data) {
  return http.post('/api/sys/roles/info', data, 'formData')
}
export function roleUpdate(data) {
  return http.put('/api/sys/roles/info', data, 'formData')
}
export function roleDelete(data) {
  return http.delete('/api/sys/roles/info?roleId='+ data, 'formData')
}
export function roleList(data) {
  return http.get('/api/sys/roles/list', data, 'formData')
}
export function roleUpdateDetail(data) {
  return http.put('/api/sys/roles/info/detail', data, 'formData')
}
//获取权限列表
export function moduleList(data) {
  return http.get('/api/sys/modules/list', data, 'formData')
}
//系统公共标签设置
export function labelListByParent(data) {
  return http.get('/api/sys/labels/list', data, 'formData')
}
export function labelListByBusinessType(data) {
  return http.get('/api/sys/labels/labelBusinessType', data, 'formData')
}
export function labelListAll(data) {
  return http.get('/api/sys/labels/listAll', data, 'formData')
}
export function setLabelState(data) {
  return http.put('/api/sys/labels/info/status', data, 'formData')
}
export function changeSort(data) {
  return http.put('/api/sys/labels/info/sort', data, 'formData')
}
export function labelAdd(data) {
  return http.post('/api/sys/labels/info', data, 'formData')
}
export function labelUpdateText(data) {
  return http.put('/api/sys/labels/info/labelText', data, 'formData')
}
//音乐管理设置
export function musicAdd(data) {
  return http.post('/api/sys/musics/info', data, 'formData')
}
export function musicList(data) {
  return http.get('/api/sys/musics/list', data, 'formData')
}
export function musicUpdate(data) {
  return http.put('/api/sys/musics/info', data, 'formData')
}
export function musicDelete(data) {
  return http.delete('/api/sys/musics/info?musicId='+data, 'formData')
}
//系统通知管理
export function noticeAdd(data) {
  return http.post('/api/sys/notices', data, 'formData')
}
export function noticeList(data) {
  return http.get('/api/sys/notices/list', data, 'formData')
}
export function noticeInfo(data) {
  return http.get('/api/sys/notices', data, 'formData')
}
export function noticeUpdate(data) {
  return http.put('/api/sys/notices', data, 'formData')
}
export function noticeState(data) {
  return http.put('/api/sys/notices/state', data, 'formData')
}
//资源文件管理
export function blessingList(data) {
  return http.get('/api/blessing/resources/list', data, 'formData')
}
export function blessingAdd(data) {
  return http.post('/api/blessing/resources/info', data, 'formData')
}
export function blessingUpdate(data) {
  return http.put('/api/blessing/resources/info', data, 'formData')
}
export function blessingState(data) {
  return http.put('/api/blessing/resources/info/state', data, 'formData')
}
export function blessingRemarkType(data) {
  return http.put('/api/blessing/resources/info/remarkType', data, 'formData')
}
export function blessingLabels(data) {
  return http.put('/api/blessing/resources/info/labels', data, 'formData')
}
export function blessingDelete(data) {
  return http.delete('/api/blessing/resources/info/delete?resourceUid='+ data, 'formData')
}
export function sendRecords(data) {
  return http.get('/api/blessing/resources/sendRecords', data, 'formData')
}

//用户档案管理中心
export function memberList(data) {
  return http.get('/api/member/members/list', data, 'formData')
}
export function memberRemark(data) {
  return http.put('/api/member/members/info/remarks', data, 'formData')
}
export function memberType(data) {
  return http.put('/api/member/members/info/type', data, 'formData')
}
export function memberLabel(data) {
  return http.put('/api/member/members/info/label', data, 'formData')
}
/*export function memberDelete(data) {
  return http.delete('/api/member/members/info/delete?memberId='+ data, 'formData')
}*/
/**
 * 商户
 */

