export default[
  {
    path: "/materialManage",
    name: "素材管理",
    icon: '',
    routes: [
      {
        path: '/materialManage/activeMaterial/list',//发放列表（批次、规则）
        name: '活动素材',
        icon: '',
        component: "@/pages/materialManage/activeMaterial/list"
      }, {
        path: '/materialManage/activeMaterial/list/newMaterial',//发放列表（批次、规则）
        name: '新建活动素材',
        icon: '',
        component: "@/pages/materialManage/activeMaterial/newMaterial"
      }
    ]
  }
]