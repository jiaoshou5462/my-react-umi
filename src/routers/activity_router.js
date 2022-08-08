//营销活动配置
export default[
  // {
  //   path:"/activityModule",
  //   name:"新增营销活动管理",
  //   component: '@/pages/activityModule',
  //   routes: [
  //     {
  //       path: '/activityModule/info',
  //       name: '活动信息',
  //       icon: 'smile',
  //       component: "@/pages/activityModule/info"
  //     },
  //   {
  //     path: '/activityModule/setPage',
  //     name: '活动页面',
  //     icon: 'smile',
  //     component: "@/pages/activityModule/setPage"
  //   },
  //   {
  //     path: '/activityModule/shape',
  //     name: '活动形式及规则',
  //     icon: 'smile',
  //     component: "@/pages/activityModule/shape"
  //   },
  //   {
  //     path: '/activityModule/deploy',
  //     name: '部署推广',
  //     icon: 'smile',
  //     component: "@/pages/activityModule/deploy"
  //   },
  //   {
  //     path: '/activityModule/finish',
  //     name: '完成',
  //     icon: 'smile',
  //     component: "@/pages/activityModule/finish"
  //   }
  // ],
  // },
  {
    path: '/activityConfig',
    name: '营销活动列表',
    icon: 'smile',
    routes:[
      {
        path: '/activityConfig/activityList',
        name: '营销活动列表',
        icon: 'smile',
        component: "@/pages/activityConfig/activityList"
      },
      {
        path:"/activityConfig/activityList/activityModule",
        name:"新增营销活动管理",
        component: '@/pages/activityModule',
        routes: [
          {
            path: '/activityConfig/activityList/activityModule/info',
            name: '活动信息',
            icon: 'smile',
            component: "@/pages/activityModule/info"
          },
          {
            path: '/activityConfig/activityList/activityModule/setPage',
            name: '活动页面',
            icon: 'smile',
            component: "@/pages/activityModule/setPage"
          },
          {
            path: '/activityConfig/activityList/activityModule/shape',
            name: '活动形式及规则',
            icon: 'smile',
            component: "@/pages/activityModule/shape"
          },
          {
            path: '/activityConfig/activityList/activityModule/deploy',
            name: '部署推广',
            icon: 'smile',
            component: "@/pages/activityModule/deploy"
          },
          {
            path: '/activityConfig/activityList/activityModule/finish',
            name: '完成',
            icon: 'smile',
            component: "@/pages/activityModule/finish"
          }
        ],
      },
    ]
  },
]
