// 标签
export default [
  {
    path: "/dataModule",
    name: "数据",
    icon: 'BarChartOutlined',
    routes: [
      {
        path: '/dataModule/tagModule',
        name: '标签管理',
        icon: '',
        // component: "",
        routes: [
          {
            path: '/dataModule/tagModule/tagPanel',
            name: '标签面板',
            icon: '',
            component: "@/pages/dataModule/tagModule/tagPanel"
          },
          {
            path: '/dataModule/tagModule/changeRecord',
            name: '变更记录',
            icon: '',
            component: "@/pages/dataModule/tagModule/changeRecord"
          },
          {
            component: './404',
          },
        ],
      },
      {
        path: '/dataModule/groupModule',
        name: '用户分群管理',
        icon: '',
        // component: "",
        routes: [
          {
            path: '/dataModule/groupModule/grouplList',
            name: '用户群列表',
            icon: '',
            component: "@/pages/dataModule/groupModule/grouplList"
          }
        ],
      },
      // {
      //   path: '/dataModule/portrayalModule',
      //   name: '用户画像管理',
      //   icon: '',
      //   // component: "",
      //   routes: [
      //     {
      //       path: '/dataModule/portrayalModule/portrayalList',
      //       name: '用户画像列表',
      //       icon: '',
      //       component: "@/pages/dataModule/portrayalModule/portrayalList"
      //     }
      //   ],
      // },
      {
        path: '/dataModule/userPortrait',
        name: '用户画像',
        icon: '',
        component: "@/pages/dataModule/userPortrait"
      },
      {
        component: './404',
      },
    ],
  },
]
