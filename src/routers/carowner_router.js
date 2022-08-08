//车主运营
export default [
  {
    path: '/demo_list',
    name: 'demo列表',
    component: '@/pages/home/demo_list',
  },
  {
    path: '/demo_detail',
    name: 'demo详情',
    component: '@/pages/home/demo_detail',
  },
  {
  path: "/carowner",
  name: "车主运营",
  routes: [
    {
      path: '/carowner/platform',
      name: '平台搭建',
      routes: [
        {
          path: '/carowner/platform/pageManage',
          name: '页面管理',
          component: '@/pages/carowner/platform/pageManage',
        },
        {
          path: '/carowner/platform/pageManage/detail',
          name: '页面管理-详情',
          component: '@/pages/carowner/platform/pageManage/detail',
        },
        {
          path: '/carowner/platform/articleManage',
          name: '文章管理',
          component: '@/pages/carowner/articleManage/list',
        },
      ]
    },
    {
      path: '/carowner/officialAccount',
      name: '公众号管理',
      routes: [
        {
          path: "/carowner/officialAccount/reply",
          name: "公众号自动回复",
          component: "@/pages/carowner/officialAccount/reply"
        },
        {
          path: "/carowner/officialAccount/configure",
          name: "公众号配置",
          component: "@/pages/carowner/officialAccount/configure",
        },
        {
          path: "/carowner/officialAccount/configure/menu",
          name: "主菜单",
          component: "@/pages/carowner/officialAccount/configure/menu",
        },
        {
          path: "/carowner/officialAccount/configure/childMenu",
          name: "子菜单",
          component: "@/pages/carowner/officialAccount/configure/childMenu",
        },
        {
          path: "/carowner/officialAccount/template",
          name: "模板消息",
          component: "@/pages/carowner/officialAccount/template"
        },
      ]
    },

    {
      path: '/carowner/messageInteraction',
      name: '消息互动',
      routes: [
        {
          path: "/carowner/messageInteraction/directionalLaunch",
          name: "定向投放",
          component: "@/pages/carowner/messageInteraction/directionalLaunch"
        },
        {
          path: "/carowner/messageInteraction/sceneTemplate",
          name: "场景模板",
          component: "@/pages/carowner/messageInteraction/sceneTemplate",
        },
        {
          path: "/carowner/messageInteraction/messageHistory",
          name: "消息记录",
          component: "@/pages/carowner/messageInteraction/messageHistory",
        },
      ]
    },
    {
      path: '/carowner/smartField',
      name: '智能栏位',
      routes: [
        {
          path: "/carowner/smartField/list",
          name: "栏位管理",
          component: "@/pages/carowner/smartField/list"
        },
        {
          path: "/carowner/smartField/list/detail",
          name: "栏位管理详情",
          component: "@/pages/carowner/smartField/detail",
        },
        {
          path: "/carowner/smartField/list/statistics",
          name: "栏位管理统计",
          component: "@/pages/carowner/smartField/list/statistics",
        },
      ]
    },
  ]
}]