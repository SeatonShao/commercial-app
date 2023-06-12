// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout, PageView } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

// const RouteView = {
//   name: 'RouteView',
//   render: h => h('router-view')
// }

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '', icon: 'home' },
    redirect: '/dashboard/welcome',
    children: [
      // dashboard
      {
        path: '/dashboard/welcome',
        name: 'welcome',
        component: () => import('@/views/welcome'),
        meta: { title: 'menu.home', icon: 'home', keepAlive: false, permission: ['dashboard'] }
      },
      // other
      {
        path: '/order',
        name: 'order',
        component: PageView,
        meta: { title: 'menu.order', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/order/cjdd',
        children: [
          {
            path: '/order/cjdd',
            name: 'cjdd',
            component: () => import('@/views/cjdd'),
            meta: { title: 'menu.dashboard.cjdd', keepAlive: false, permission: ['dd'] }
          },
          {
            path: '/order/cjdd2',
            name: 'cjdd2',
            component: () => import('@/views/cjdd2'),
            meta: { title: 'menu.dashboard.cjdd2', keepAlive: false, permission: ['dd2'] }
          },
          {
            path: '/order/ddlb/',
            name: 'ddlb',
            component: () => import('@/views/ddlb/index'),
            meta: { title: 'menu.dashboard.ddlb', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/order/shdz',
            name: 'shdz',
            component: () => import('@/views/shdz'),
            meta: { title: 'menu.dashboard.shdz', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/order/ddxq',
            name: 'ddxq',
            hidden: true,
            component: () => import('@/views/ddxq'),
            meta: { show: false, title: 'menu.dashboard.ddxq', keepAlive: false, permission: ['dashboard'] }
          },
          {
            path: '/order/zhsz',
            name: 'zhsz',
            hidden: true,
            component: () => import('@/views/zhsz'),
            meta: { title: 'menu.dashboard.zhsz', keepAlive: false, permission: ['dashboard'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/ForgotPwd')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
