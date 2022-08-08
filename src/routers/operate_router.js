//账单管理
export default [
  {
    path: "/operate",
    name: "营销项目",
    icon: 'CreditCardOutlined',
    routes: [
      {
        path: "/operate/marketingProject",//营销项目
        name: '营销项目',
        component: "@/pages/operate/marketingProject"
      },
    ]
  },
  {
    path: "/strategicManage",
    name: "营销策略",
    icon: '',
    routes: [
      {
        path: '/strategicManage/list',
        name: '策略管理',
        icon: '',
        component: "@/pages/strategicManage/list"
      }, {
        path: '/strategicManage/list/createStrategic',
        name: '创建营销策略',
        icon: '',
        component: "@/pages/strategicManage/createStrategic"
      },
      {
        path: '/strategicManage/list/strategicDetail',
        name: '营销策略详情',
        icon: '',
        component: "@/pages/strategicManage/strategicDetail"
      },{
        path: '/strategicManage/triggerLog',
        name: '执行记录',
        icon: '',
        component: "@/pages/strategicManage/triggerLog"
      }
    ]
  }
]
