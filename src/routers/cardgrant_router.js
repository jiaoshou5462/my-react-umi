//账单管理
export default [
  {
    path: "/cardgrantManage",
    name: "卡券发放管理",
    icon: 'CreditCardOutlined',
    routes: [
      {
        path: '/cardgrantManage/grantList',//发放列表（批次、规则）
        name: '卡券发放管理',
        icon: '',
        component: "@/pages/cardgrantManage"
      },
      {
        path: "/cardgrantManage/grantList/newDistribution",//新增发放
        name: '新增直投发放',
        component: "@/pages/cardgrantManage/grantList/newDistribution"
      },
      {
        path: "/cardgrantManage/grantList/editDistribution",//编辑
        name: '编辑直投发放',
        component: "@/pages/cardgrantManage/grantList/newDistribution/edit"
      },
      {
        path: "/operate/marketingProject",//营销项目
        name: '营销项目',
        component: "@/pages/operate/marketingProject"
      },
      {
        path: "/cardgrantManage/management",//卡券管理
        name: '卡券管理',
        component: "@/pages/cardgrantManage/cardManagement"
      }
    ]
  }
]
