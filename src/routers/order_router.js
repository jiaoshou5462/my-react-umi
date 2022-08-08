//订单
export default [
  {
    path: "/order",
    name: "订单",
    icon: 'AccountBookOutlined',
    routes: [
      {
        path: '/order/driveOrder/list',
        name: '代驾订单列表',
        icon: '',
        component: "@/pages/order/driveOrder/list"
      }, {
        path: '/order/driveOrder/list/detail',
        name: '代驾订单详情',
        icon: '',
        component: "@/pages/order/driveOrder/detail"
      }, {
        path: '/order/carWashOrder/list',
        name: '洗车订单列表',
        icon: '',
        component: "@/pages/order/carWashOrder/list"
      }, {
        path: '/order/carWashOrder/list/detail',
        name: '洗车订单详请',
        icon: '',
        component: "@/pages/order/carWashOrder/detail"
      }, {
        path: '/order/safetyInspectOrder/list',
        name: '安全检测订单列表',
        icon: '',
        component: "@/pages/order/safetyInspectOrder/list"
      }, {
        path: '/order/safetyInspectOrder/list/detail',
        name: '安全检测订单详请',
        icon: '',
        component: "@/pages/order/safetyInspectOrder/detail"
      }, {
        path: '/order/agentOrder/list',
        name: '代办年检订单列表',
        icon: '',
        component: "@/pages/order/agentOrder/list"
      }, {
        path: '/order/agentOrder/list/detail',
        name: '代办年检订单详请',
        icon: '',
        component: "@/pages/order/agentOrder/detail"
      }, {
        path: '/order/rescueOrder/list',
        name: '救援订单列表',
        icon: '',
        component: "@/pages/order/rescueOrder/list"
      }, {
        path: '/order/rescueOrder/list/detail',
        name: '救援订单详请',
        icon: '',
        component: "@/pages/order/rescueOrder/detail"
      },
      {
        path: '/order/rescueOrder/list/createNewOrder',
        name: '新建救援订单',
        icon: '',
        component: "@/pages/order/rescueOrder/createNewOrder"
      },{
        path: '/order/scooterOrder/list',
        name: '代步车订单列表',
        icon: '',
        component: "@/pages/order/scooterOrder/list"
      }, {
        path: '/order/scooterOrder/list/detail',
        name: '代步车订单详情',
        icon: '',
        component: "@/pages/order/scooterOrder/detail"
      },{
        path: '/order/cargoDeclarationOrder/list',
        name: '货运申报订单列表',
        icon: '',
        component: "@/pages/order/cargoDeclarationOrder/list"
      },{
        path: '/order/rechargeCardOrder/list',
        name: '油卡充值订单列表',
        icon: '',
        component: "@/pages/order/rechargeCardOrder/list"
      }, {
        path: '/order/rechargeCardOrder/list/detail',
        name: '油卡充值订单详情',
        icon: '',
        component: "@/pages/order/rechargeCardOrder/detail"
      },{
        path: '/order/eMaintOrder/list',
        name: 'E养车保养订单列表',
        icon: '',
        component: "@/pages/order/eMaintOrder/list"
      }, {
        path: '/order/eMaintOrder/list/detail',
        name: 'E养车保养订单详情',
        icon: '',
        component: "@/pages/order/eMaintOrder/detail"
      },{
        path: '/order/maintainOrder/list',
        name: '保养订单列表',
        icon: '',
        component: "@/pages/order/maintainOrder/list"
      }, {
        path: '/order/maintainOrder/list/detail',
        name: '保养订单详情',
        icon: '',
        component: "@/pages/order/maintainOrder/detail"
      }, {
        path: '/order/productOrder/list',
        name: '产品订单',
        icon: '',
        component: "@/pages/order/productOrder/list"
      }, {
        path: '/order/complaintOrder/list',//  投诉管理
        name: '投诉管理',
        icon: '',
        component: "@/pages/qualityManagement/complaintManagement"
      },{
        path: '/order/complaintOrder/list/detail',//  投诉管理详情
        name: '投诉管理详情',
        icon: '',
        component: "@/pages/qualityManagement/complaintManagement/detail"
      }, {
        path: '/order/evaluateOrder/list', //  评价管理
        name: '评价管理',
        icon: '',
        component: "@/pages/qualityManagement/evaluateManagement"
      },{
        path: '/order/evaluateOrder/list/detail', //  评价管理详情
        name: '评价管理详情',
        icon: '',
        component: "@/pages/qualityManagement/evaluateManagement/detail"
      },
      // {
      //   path: '/order/flowerOrder/list',
      //   name: '鲜花订单列表',
      //   icon: '',
      //   component: "@/pages/order/flowerOrder/list"
      // }, {
      //   path: '/order/flowerOrder/list/detail',
      //   name: '鲜花订单详情',
      //   icon: '',
      //   component: "@/pages/order/flowerOrder/detail"
      // }
    ]
  }
]
