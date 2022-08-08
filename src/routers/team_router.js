//团队管理 && 掌客工具
export default [
  {
    path: "/teamManage",
    name: "团队管理",
    icon: 'AccountBookOutlined',
    routes: [
      {
        path: '/teamManage/list',
        name: '团队列表',
        icon: '',
        component: "@/pages/teamManage/list"
      }, {
        path: '/teamManage/list/detail',
        name: '团队详请',
        icon: '',
        component: "@/pages/teamManage/detail"
      },{
        path: "/teamManage/list/salesDetail",
        name: '销售详情',
        component: "@/pages/salesManage/salesDetail"
      }, {
        path: '/teamManage/list/smallDetail',
        name: '客户详情',
        icon: '',
        component: "@/pages/customerManage/listDetail"
      },
    ]
  },
  {
    path: "/palmGuest",
    name: "掌客工具",
    routes: [
      {
        path: '/palmGuest/informationManager',
        name: '掌客工具',
        component: "@/pages/informationManager"
      },{
        path: '/palmGuest/propagandaPoster',
        name: '宣传海报',
        component: "@/pages/propagandaPoster"
      },{
        path: '/palmGuest/productManage',
        name: '产品管理',
        component: "@/pages/productManage"
      },{
        path: '/palmGuest/obtainCodeGuest',
        name: '获客码',
        component: "@/pages/obtainCodeGuest"
      },
    ]
  },
  
]
