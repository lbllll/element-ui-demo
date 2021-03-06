import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken();
  // 跳转路由之前清空store里的SetNavIndex，否则使用$router跳转页面时不会渲染左侧导航栏
  store.commit("user/SetNavIndex", '');

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，重定向到主页
      var route = JSON.parse(window.sessionStorage.getItem('route'))
      try {
        console.log("permission");
        let menu = [];
        route.forEach(e => {
          if(e.moduleType === "MENU"){
            menu.push(e);
          }
        });
        var name = '';
        for (let i = 0; i < menu.length; i++) {
          if(menu[i].routeCode){
            name = menu[i].routeCode;
            break;
          }
        }
        // debugger
        next({ name: name })
      } catch (error) {
        next({ path: '/' })
      }
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
