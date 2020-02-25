import request from '@/utils/request'
import http from '@/utils/http'

/**
 * 第三个参数，需要post请求，formData传参方式时，传入该字符串。
 */

export function login(data,url) {
  return http.post(url, data, 'formData')
}


export function userPermission(data) {
  return http.get('/api/sys/modules/list', data, 'formData')
}


export function getInfo(token) {
  return request({
    url: '/sys/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/sys/user/logout',
    method: 'post'
  })
}
