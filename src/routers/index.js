import tag_router from './tag_router'
import activity_router from './activity_router'
import finance_router from './finance_router'
import cardgrant_router from './cardgrant_router'
import privilege_router from './privilege_router'
import platformBuild_router from './platformBuild_router'
import operate_router from './operate_router'
import customerManage_router from './customerManage_router'
import payableInvoices_router from './payableInvoices_router'
import card_router from './card_router'
import order_router from './order_router'
import dataAnalysis_router from './dataAnalysis_router'
import sales_router from './sales_router'
import carowner_router from './carowner_router'
import team_router from './team_router'
import insuranceSuper from './insuranceSuper'
import materialManage_router from './materialManage_router'
import saleTask_router from './saleTask_router'
import popupTouch_router from './popupTouch_router'
import activityCenter_router from './activityCenter_router'
import quotaManagement_router from './quotaManagement_router'

//路由配置
export default [
  {
    path: '/',
    component: '@/layouts/BlankLayout',
    routes: [
      { path: '/', redirect: '/login' },
      {
        path: '/login',
        component: '@/layouts/UserLayout',
        routes: [
          {
            path: '/login',
            name: '登录',
            icon: '',
            component: './login',
          },
        ],
      },
      {
        path: '/forgetPwd',
        name: '找回密码',
        component: '@/pages/login/forgetPwd',
      },
      {
        path: '/',
        component: '@/layouts/BasicLayout',
        routes: [
          ...tag_router,
          ...cardgrant_router,
          ...finance_router,
          ...privilege_router,
          ...platformBuild_router,
          ...activity_router,
          ...operate_router,
          ...payableInvoices_router,
          ...card_router,
          ...order_router,
          ...customerManage_router,
          ...dataAnalysis_router,
          ...sales_router,
          ...carowner_router,
          ...team_router,
          ...insuranceSuper,
          ...materialManage_router,
          ...saleTask_router,
          ...popupTouch_router,
          ...activityCenter_router,
          ...quotaManagement_router,
          {
            path: '/home',
            name: '首页',
            component: '@/pages/home',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
