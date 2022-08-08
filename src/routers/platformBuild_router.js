//平台搭建
export default [
  {
    path: "/platformBuild",
    name: "平台搭建",
    icon: 'InsertRowBelowOutlined',
    routes: [
      {
        path: '/platformBuild/growthSystem',
        name: '成长体系',
        routes: [
          {
            path: "/platformBuild/growthSystem/home",
            name: "成长体系",
            component: "@/pages/growthSystem/home"
          }, {
            path: "/platformBuild/growthSystem/levelConfig",
            name: "等级配置",
            component: "@/pages/growthSystem/levelConfig"
          }, {
            path: "/platformBuild/growthSystem/levelAdd",
            name: "添加等级",
            component: "@/pages/growthSystem/levelAdd"
          }, {
            path: "/platformBuild/growthSystem/rightList",
            name: "权益管理",
            component: "@/pages/growthSystem/rightList"
          }, {
            path: "/platformBuild/growthSystem/addRight",
            name: "权益管理",
            component: "@/pages/growthSystem/addRight"
          }, {
            path: "/platformBuild/growthSystem/taskManage",
            name: "任务管理",
            component: "@/pages/growthSystem/taskManage"
          }, {
            path: "/platformBuild/growthSystem/taskDetails",
            // name: "任务管理",
            component: "@/pages/growthSystem/taskDetails"
          }
        ]
      },
      {
        path: '/platformBuild/integralManage',
        name: '积分管理',
        routes: [
          {
            path: "/platformBuild/integralManage/pointsAccount",
            name: "积分账户",
            routes: [
              {
                path: "/platformBuild/integralManage/pointsAccount/homeAccount",
                name: "积分账户",
                component: "@/pages/integralManage/pointsAccount/homeAccount"
              },
              {
                path: "/platformBuild/integralManage/pointsAccount/detailAccount",
                name: "账户详情",
                component: "@/pages/integralManage/pointsAccount/detailAccount"
              }
            ]
          },
        ]
      }
    ]
  }
]
