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


var routeList = [
  {
    "path": "/",
    "component": "Layout",
    "redirect": "/",
    "name": "HOME",
    "meta": {
      "title": "首页",
      "icon": null
    },
    "type": "HOME",
    "children": [
      {
        "path": "/home/index",
        "component": "/home/index",
        "redirect": "/home/index",
        "name": "HOME_DASHBOARD",
        "meta": {
          "title": "系统首页",
          "icon": null
        },
        "type": "HOME_DASHBOARD",
        "children": null
      },
      {
        "path": "/home/setting",
        "component": "/home/setting",
        "redirect": "/home/setting",
        "name": "HOME_SETTING",
        "meta": {
          "title": "账号设置",
          "icon": null
        },
        "type": "HOME_SETTING",
        "children": null
      },
      {
        "path": "/home/account",
        "component": "/home/account",
        "redirect": "/home/account",
        "name": "HOME_ACCOUNT_LIST",
        "meta": {
          "title": "成员管理",
          "icon": null
        },
        "type": "HOME_ACCOUNT_LIST",
        "children": null
      },
      {
        "path": "/home/log",
        "component": "/home/log",
        "redirect": "/home/log",
        "name": "HOME_LOG",
        "meta": {
          "title": "操作日志",
          "icon": null
        },
        "type": "HOME_LOG",
        "children": null
      }
    ]
  },
  {
    path: "/product",
    component: "Layout",
    redirect: "/product",
    name: "PRODUCT",
    meta: {
      title: "商品",
      icon: null
    },
    type: "PRODUCT",
    children: [
      {
        path: "/product/list",
        component: "/product/list",
        redirect: "/product/list",
        name: "PRODUCT_LIST",
        meta: {
          title: "商品列表",
          icon: null
        },
        type: "PRODUCT_LIST",
        children: null
      },
      {
        path: "/product/release",
        component: "/product/release",
        redirect: "/product/release",
        name: "PRODUCT_RELEASE",
        meta: {
          title: "商品发布",
          icon: null
        },
        type: "PRODUCT_RELEASE",
        children: null
      },
      {
        path: "/product/category",
        component: "/product/category",
        redirect: "/product/category",
        name: "PRODUCT_CATEGORY",
        meta: {
          title: "商品分类",
          icon: null
        },
        type: "PRODUCT_CATEGORY",
        children: null
      },
      {
        path: "/product/statistics",
        component: "/product/statistics",
        redirect: "/product/statistics",
        name: "PRODUCT_STATISTICS",
        meta: {
          title: "商品统计",
          icon: null
        },
        type: "PRODUCT_STATISTICS",
        children: null
      },
      {
        path: "/product/collection",
        component: "/product/collection",
        redirect: "/product/collection",
        name: "PRODUCT_COLLECTION",
        meta: {
          title: "商品收藏",
          icon: null
        },
        type: "PRODUCT_COLLECTION",
        children: null
      },
      {
        path: "/product/recycle",
        component: "/product/recycle",
        redirect: "/product/recycle",
        name: "PRODUCT_RECYCLE",
        meta: {
          title: "回收站",
          icon: null
        },
        type: "PRODUCT_RECYCLE",
        children: null
      }
    ]
  },
  {
    "path": "/order",
    "component": "Layout",
    "redirect": "/order",
    "name": "ORDER",
    "meta": {
      "title": "订单",
      "icon": null
    },
    "type": "ORDER",
    "children": [
      {
        "path": "/order/list",
        "component": "/order/list",
        "redirect": "/order/list",
        "name": "PRODUCT_ORDER_LIST",
        "meta": {
          "title": "订单列表",
          "icon": null
        },
        "type": "PRODUCT_ORDER_LIST",
        "children": null
      },
      {
        "path": "/order/detail",
        "component": "/order/detail",
        "redirect": "/order/detail",
        "name": "PRODUCT_ORDER_DETAIL",
        "meta": {
          "title": "订单详情",
          "icon": null
        },
        "type": "PRODUCT_ORDER_DETAIL",
        "children": null,
        hidden: false
      },
      {
        "path": "/order/delivery",
        "component": "/order/delivery",
        "redirect": "/order/delivery",
        "name": "PRODUCT_DELIVERY",
        "meta": {
          "title": "提货订单",
          "icon": null
        },
        "type": "PRODUCT_DELIVERY",
        "children": null
      },
      // {
      //   "path": "/order/stock",
      //   "component": "/order/stock",
      //   "redirect": "/order/stock",
      //   "name": "PRODUCT_STOCK",
      //   "meta": {
      //     "title": "缺货处理",
      //     "icon": null
      //   },
      //   "type": "PRODUCT_STOCK",
      //   "children": null
      // }
    ]
  }
];

export var constantRoutes = [
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
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/home/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // }
]

routeList = JSON.parse(window.sessionStorage.getItem('route')) || []

routeList.forEach(e => {
  var routeItem = {
    path: e.path,
    component: Layout,
    redirect: '',
    name: e.name,
    meta: { title: e.meta.title },
    type: e.type,
    children: []
  };
  // 首页的一级路由直接重定向至/home/index
  if (e.name == 'HOME') {
    routeItem.redirect = '/home'
  }
  e.children.forEach((i, index) => {
    var path = i.path.split('/')
    if (index == 0 && !routeItem.redirect) {
      routeItem.redirect = e.redirect + '/' + path[2]
    }
    if (index == 0 && path[2] == 'index') {
      path[2] = 'home'
    }
    /* component: () => import()   不能使用变量，必须用模板字符串 */
    routeItem.children.push({
      path: path[2],
      component: () => import(`@/views${i.component}`),
      name: i.name,
      meta: { title: i.meta.title, type: e.type },
      type: i.type,
      hidden: i.hidden
    })
  });
  constantRoutes.push(routeItem)
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
  var newConstantRoutes = [
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
    // {
    //   path: '/',
    //   component: Layout,
    //   redirect: '/home',
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/home/index'),
    //       name: 'Dashboard',
    //       meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
    //     }
    //   ]
    // }
  ]

  routeList = JSON.parse(window.sessionStorage.getItem('route')) || []

  routeList.forEach(e => {
    var routeItem = {
      path: e.path,
      component: Layout,
      redirect: '',
      name: e.name,
      meta: { title: e.meta.title },
      type: e.type,
      children: []
    };
    // 首页的一级路由直接重定向至/home/index
    if (e.name == 'HOME') {
      routeItem.redirect = '/home'
    }
    e.children.forEach((i, index) => {
      var path = i.path.split('/')
      if (index == 0 && !routeItem.redirect) {
        routeItem.redirect = e.redirect + '/' + path[2]
      }
      if (index == 0 && path[2] == 'index') {
        path[2] = 'home'
      }
      /* component: () => import()   不能使用变量，必须用模板字符串 */
      routeItem.children.push({
        path: path[2],
        component: () => import(`@/views${i.component}`),
        name: i.name,
        meta: { title: i.meta.title, type: e.type },
        type: i.type,
        hidden: i.hidden
      })
    });
    newConstantRoutes.push(routeItem)
  });
  // 404 页面必须在最后加载
  newConstantRoutes.push({ path: '*', redirect: '/404', hidden: true })

  var newCreateRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: newConstantRoutes
  })
  const newRouter = newCreateRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
