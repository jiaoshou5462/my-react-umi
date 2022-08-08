//销售任务
export default [
  {
    path: "/sale",
    name: "销售任务",
    icon: 'TeamOutlined',
    routes:[
      {
        path: '/sale/task',//销售任务
        name: '任务管理',
        component: "@/pages/sale/task"
      },
      {
        path: '/sale/task/taskDataView',//数据看板
        name: '数据看板',
        component: "@/pages/sale/taskDataView"
      },
      {
        path:"/sale/task/saleTaskModule",
        name:"新增销售任务",
        component: '@/pages/sale/taskModule',
        routes: [
          {
            path: '/sale/task/saleTaskModule/info',
            name: '基础信息',
            component: "@/pages/sale/taskModule/info"
          },
          {
            path: '/sale/task/saleTaskModule/taskreward',
            name: '设置任务kpi和奖励',
            component: "@/pages/sale/taskModule/taskreward"
          },
          {
            path: '/sale/task/saleTaskModule/distribution',
            name: '分配员工',
            component: "@/pages/sale/taskModule/distribution"
          },
          {
            path: '/sale/task/saleTaskModule/finish',
            name: '完成',
            component: "@/pages/sale/taskModule/finish"
          },
        ],
      },
    ]
  }
]
