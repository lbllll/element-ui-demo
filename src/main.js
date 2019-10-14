import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import elementUIVerify from 'element-ui-verify'

import '@/styles/index.scss' // global css
import Util from './utils/utils'
Vue.prototype.$util = Util

import App from './App'
import router from './router'
import store from './store'


import '@/icons' // icon
import '@/permission' // permission control

var base = ''

if (window.location.href.indexOf(process.env.VUE_APP_URLCONT) != -1) {
  base = 'VUE_APP_BASE_API'
} else {
  base = 'VUE_APP_SHOP_API'
}
Vue.prototype.$base = base


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}


let Message = {
  empty: '{alias}不能为空',
  length: '请输入{length}位字符',
  minLength: '{alias}至少{minLength}位',
  number: '请输入数字',
  int: '请输入整数',
  lt: '{alias}应小于{lt}',
  lte: '{alias}不能大于{lte}',
  gt: '{alias}应大于{gt}',
  gte: '{alias}不能小于{gte}',
  maxDecimalLength: '{alias}最多接受{maxDecimalLength}位小数',
  phone: '请输入正确的手机号',
  email: '请输入正确的邮箱',
  verifyCode: '请输入正确的验证码'
}



// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(elementUIVerify, {
  errorMessageTemplate: Message,
  fieldChange: 'clear'
})

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
