

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

var base = 'VUE_APP_BASE_API'
//如果是本地环境有VUE_APP_URLCONT就执行本地，不是则执行线上环境的VUE_APP_SHOP_API
if (window.location.href.indexOf(process.env.VUE_APP_URLCONT) != -1) {
  base = 'VUE_APP_BASE_API'
} else {
  base = 'VUE_APP_SHOP_API'
}

const service = axios.create({
  baseURL: process.env[base], // url = base url + request url
  // withCredentials: true, // 跨域请求时发送cookies
  timeout: 10000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['access_token'] = getToken()
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  /**
   * 如果您想要获取诸如头或状态之类的http信息
   * Please return  response => response
  */
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.description || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      // return Promise.reject(new Error(res.message || 'Error'))
      return Promise.reject(res.description || 'Error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
