import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store';

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */


let routeList = [];

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
];

routeList = JSON.parse(window.sessionStorage.getItem('route')) || [];

//组装菜单列表
let menuParentArr = [];
let menuChildArr = [];
let Auth = [];

routeList.forEach(e => {
  //组装一级菜单
  if(e.moduleType === "MENU" && e.moduleParentTreeCode == -1) {
    e.child = [];
    menuParentArr.push(e)
  }
  //非一级菜单
  if(e.moduleType === "MENU" && e.moduleParentTreeCode != -1){
    menuChildArr.push(e)
  }
});
//遍历一级菜单，插入所属二级菜单
menuParentArr.forEach(item  => {
  menuChildArr.forEach(child => {
    if(item.moduleTreeCode === child.moduleParentTreeCode){
      item.child.push(child);
    }
  });
});
//组装路由
menuParentArr.forEach(e => {
  let routeItem = {
    path: e.moduleUrl,
    component: Layout,
    meta: { title: e.moduleName },
    redirect:'',
    children: []
  };
  e.child.forEach( (i, index) => {
    /*添加二级菜单 children component: () => import()   不能使用变量，必须用模板字符串 */
    routeItem.children.push(
      {
        path: i.moduleUrl.split('/')[i.moduleUrl.split('/').length-1],
        component: () => import(`@/views${i.moduleUrl}`),
        name: i.routeCode,
        meta: { title: i.moduleName },
      });
    //如果有首页菜单权限那就跳首页
    if(index === 0 && e.moduleUrl === '/'){
      routeItem.redirect = i.moduleUrl.split('/')[i.moduleUrl.split('/').length-1];
    }
    if(index === 0 && routeItem.redirect === ''){
      routeItem.redirect = i.moduleUrl
    }
  });
  constantRoutes.push(routeItem);
});
// 404 页面必须在最后加载
constantRoutes.push({ path: '*', redirect: '/404', hidden: true })

var createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  let newConstantRoutes = [
    {
      path: '/login',
      component: () => import('@/views/login/index'),
      hidden: true
    },

    {
      path: '/404',
      component: () => import('@/views/404'),
      hidden: true
    },
  ];

  routeList = JSON.parse(window.sessionStorage.getItem('route')) || [];


  //组装菜单列表
  let menuParentArr = [];
  let menuChildArr = [];
  let Auth = [];

  routeList.forEach(e => {
    //组装一级菜单
    if(e.moduleType === "MENU" && e.moduleParentTreeCode == -1) {
      e.child = [];
      menuParentArr.push(e)
    }
    //非一级菜单
    if(e.moduleType === "MENU" && e.moduleParentTreeCode != -1){
      menuChildArr.push(e)
    }
  });
  //遍历一级菜单，插入所属二级菜单
  menuParentArr.forEach(item  => {
    menuChildArr.forEach(child => {
      if(item.moduleTreeCode === child.moduleParentTreeCode){
        item.child.push(child);
      }
    });
  });
  //组装路由
  menuParentArr.forEach(e => {
    let routeItem = {
      path: e.moduleUrl,
      component: Layout,
      meta: { title: e.moduleName },
      redirect:'',
      children: []
    };
    e.child.forEach( (i, index) => {
      /*添加二级菜单 children component: () => import()   不能使用变量，必须用模板字符串 */
      routeItem.children.push(
        {
          path: i.moduleUrl.split('/')[i.moduleUrl.split('/').length-1],
          component: () => import(`@/views${i.moduleUrl}`),
          name: i.routeCode,
        });
      //如果有首页菜单权限那就跳首页
      if(index === 0 && e.moduleUrl === '/'){
        routeItem.redirect = i.moduleUrl.split('/')[i.moduleUrl.split('/').length-1];
      }
      if(index === 0 && routeItem.redirect === ''){
        routeItem.redirect = i.moduleUrl
      }
    });
    newConstantRoutes.push(routeItem);
  });

  // 404 页面必须在最后加载
  newConstantRoutes.push({ path: '*', redirect: '/404', hidden: true })

  const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: newConstantRoutes
  })
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
