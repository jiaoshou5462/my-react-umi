export default [
  {
    path: "/customerManage",
    name: "用户管理",
    icon: '',
    routes: [
      {
        path: '/customerManage/list',//发放列表（批次、规则）
        name: '列表管理',
        icon: '',
        component: "@/pages/customerManage/list"
      }, {
        path: '/customerManage/list/listDetail',//发放列表（批次、规则）
        name: '用户详情',
        icon: '',
        component: "@/pages/customerManage/listDetail"
      },
      {
        path: '/customerManage/feedbackList',//用户反馈列表
        name: '用户反馈列表',
        icon: '',
        component: "@/pages/customerManage/feedbackList"
      },
      {
        path: '/customerManage/feedbackList/detail',//反馈详情
        name: '反馈详情',
        icon: '',
        component: "@/pages/customerManage/feedbackList/detail"
      }
    ]
  }
]