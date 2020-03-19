
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
export function labelDelete(data) {
  return http.delete('/api/sys/labels/info?labelId='+data, 'formData')
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
export function sendRecordCounts(data) {

  return http.get('/api/blessing/resources/sendRecordCounts', data, 'formData')
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

//活动基础信息控制类
export function campaignsList(data) {
  return http.get('/api/campaigns/list', data, 'formData')
}
export function campaignsAdd(data) {
  return http.post('/api/campaigns/info', data, 'formData')
}
export function campaignsUpdate(data) {
  return http.put('/api/campaigns/info', data, 'formData')
}
export function campaignsDelete(data) {
  return http.post('/api/campaigns/info/delete',data, 'formData')
}
export function campaignsState(data) {
  return http.put('/api/campaigns/info/state', data, 'formData')
}
export function campaignsOnline(data) {
  return http.post('/api/campaigns/info/online', data, 'formData')
}
export function campaignsRules(data) {
  return http.post('/api/campaigns/info/rules', data, 'formData')
}
//查询活动规则
export function campaignsRulesList(data) {
  return http.get('/api/campaigns/info/rules/list', data, 'formData')
}
export function campaignsSetRules(data) {
  return http.post('/api/campaigns/info/setRules', data, 'formData')
}
//活动物资相关
//追加物资明细
export function campaignsMaterialAdd(data) {
  return http.post('/api/campaigns/material/detail', data, 'formData')
}
//创建活动物资
export function campaignsMaterialCreate(data) {
  return http.post('/api/campaigns/material/info', data, 'formData')
}
//修改活动物资
export function campaignsMaterialUpdate(data) {
  return http.put('/api/campaigns/material/info', data, 'formData')
}
//查询活动物资操作明细
export function campaignsMaterialDetailList(data) {
  return http.get('/api/campaigns/material/info/detail/list', data, 'formData')
}
//删除活动物资
export function campaignsMaterialDelete(data) {
  return http.post('/api/campaigns/material/info/delete',data,'formData')
}
//查询活动物资列表
export function campaignsMaterialList(data) {
  return http.get('/api/campaigns/material/info/list', data, 'formData')
}


//活动红包相关
//创建活动红包
export function campaignsRedPacketAdd(data) {
  return http.post('/api/campaigns/redPacket/info', data, 'formData')
}
//查看活动红包投放记录
export function campaignsRedPacketList(data) {
  return http.get('/api/campaigns/redPacket/list', data, 'formData')
}
//查看某用户红包领取记录
export function campaignsRedPacketMemberDetail(data) {
  return http.get('/api/campaigns/redPacket/member/detail', data, 'formData')
}
//查询某用户红包领取汇总信息
export function campaignsRedPacketMemberTotal(data) {
  return http.get('/api/campaigns/redPacket/member/total', data, 'formData')
}
//活动物资领取记录列表
//活动物资确认
export function campaignsMaterialConfirm(data) {
  return http.post('/api/campaigns/material/manager/info/confirm', data, 'formData')
}
//兑换订单物流查询
export function campaignsMaterialDelivery(data) {
  return http.get('/api/campaigns/material/manager/info/delivery', data, 'formData')
}
//查询活动物资列表
export function campaignsMaterialInfoList(data) {
  return http.get('/api/campaigns/material/manager/info/list', data, 'formData')
}
//活动物资兑换订单发货
export function campaignsMaterialSend(data) {
  return http.post('/api/campaigns/material/manager/info/send', data, 'formData')
}
//获取物流公司列表
export function trackingCompanyList(data) {
  return http.get('/api/delivery/channel/list', data, 'formData')
}
//活动查询用户发送祝福列表
export function sendBlessingRecordList(data) {
  return http.get('/api/campaigns/blessing/sendRecord', data, 'formData')
}
//用户积分查询
export function userPointList(data) {
  return http.get('/api/campaigns/points/list', data, 'formData')
}
//获取用户领取物资记录
export function userGetMaterialList(data) {
  return http.get('/api/campaigns/points/materials/detail', data, 'formData')
}
//红包领取记录查询
export function userPacketRecordList(data) {
  return http.get('/api/campaigns/packet/record', data, 'formData')
}


