//销售管理
export default [
  {
    path: "/salesManage",
    name: "账单管理",
    icon: 'AccountBookOutlined',
    routes: [
      {
        path: '/salesManage/list',//列表
        name: '销售列表',
        icon: '',
        component: "@/pages/salesManage"
      },
      {
        path: "/salesManage/list/detail",
        component: "@/pages/salesManage/salesDetail"
      },
      {
        path: '/salesManage/list/detail/smallDetail',
        name: '客户详情',
        icon: '',
        component: "@/pages/customerManage/listDetail"
      },
      {
        path: "/salesManage/list/importList",
        name: "导入销售客户",
        component: "@/pages/salesManage/importList"
      }
    ]
  }
]
