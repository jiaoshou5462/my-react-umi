//账单管理
export default [
  {
    path: "/financeManage",
    name: "账单管理",
    icon: 'AccountBookOutlined',
    routes: [
      {
        path: '/financeManage/billList',//账单列表
        name: '账单列表',
        icon: '',
        component: "@/pages/financeManage/billList"
      },
      {
        path: "/financeManage/billList/detailRealed",//1据实查看/处理（已入账）
        component: "@/pages/financeManage/billList/detailRealed"
      },
      {
        path: "/financeManage/billList/detailChargeed",//2采购查看/处理（已入账）
        component: "@/pages/financeManage/billList/detailChargeed"
      },
      {
        path: "/financeManage/billList/softwareValueadded",//3,4软件，增值查看/处理（已入账）
        component: "@/pages/financeManage/billList/softwareValueadded"
      },
      {
        path: "/financeManage/billList/adjustmentBatch",//批量调整金额（已入账）
        component: "@/pages/financeManage/billList/components/adjustmentBatch"
      },
      {
        path: "/financeManage/billList/revokeBatch",//批量撤销入账（已入账）
        component: "@/pages/financeManage/billList/components/revokeBatch"
      }, {
        path: '/financeManage/billHandle',//账单处理
        name: '账单处理',
        icon: '',
        component: "@/pages/financeManage/billHandle"
      },
      {
        path: "/financeManage/billHandle/billDetails",//账单处理-账单明细
        component: "@/pages/financeManage/billHandle/billDetails"
      }, {
        path: "/financeManage/billHandle/handleList",//账单处理-明细列表
        component: "@/pages/financeManage/billHandle/handleList"
      },
      {
        path: '/financeManage/billSettlementReconciliation',//结算对账
        name: '结算对账',
        component: "@/pages/financeManage/billSettlementReconciliation"
      },
      {
        path: '/financeManage/generateBill',//生成账单
        name: '生成账单',
        component: "@/pages/financeManage/generateBill"
      },
      {
        path: "/financeManage/billSettlementReconciliation/orderList",//结算对账-订单列表
        component: "@/pages/financeManage/billSettlementReconciliation/orderList"
      },
      {
        path: '/financeManage/billSettlementReconciliation/detailExpeditedService',
        // name: '订单详情-代办年检', // 订单详情-代办年检
        component: '@/pages/financeManage/billSettlementReconciliation/detailExpeditedService',
      },
      {
        path: '/financeManage/billSettlementReconciliation/detailRescue',
        // name: '订单详情-救援', // 订单详情-救援
        component: '@/pages/financeManage/billSettlementReconciliation/detailRescue',
      },
      {
        path: '/financeManage/billSettlementReconciliation/detailDriving',
        // name: '订单详情-代驾', // 订单详情-代驾
        component: '@/pages/financeManage/billSettlementReconciliation/detailDriving',
      },
      {
        path: '/financeManage/billSettlementReconciliation/detailSafetyDetection',
        // name: '订单详情-安全检测', // 订单详情-安全检测
        component: '@/pages/financeManage/billSettlementReconciliation/detailSafetyDetection',
      },
      {
        path: '/financeManage/billSettlementReconciliation/detailScooter',
        // name: '订单详情-代步车', // 订单详情-代步车
        component: '@/pages/financeManage/billSettlementReconciliation/detailScooter',
      },
      {
        path: '/financeManage/billSettlementReconciliation/detailTyre',
        // name: '订单详情-轮胎存换', // 订单详情-轮胎存换
        component: '@/pages/financeManage/billSettlementReconciliation/detailTyre',
      },
      {
        path: '/financeManage/billSettlementReconciliation/detailMarketing',
        // name: '订单详情-营销投放', // 订单详情-营销投放
        component: '@/pages/financeManage/billSettlementReconciliation/detailMarketing',
      },
      {
        path: "/financeManage/billSettlementReconciliation/BatchOperation",//结算对账-订单列表-批量操作
        component: "@/pages/financeManage/billSettlementReconciliation/BatchOperation"
      },
      {
        path: "/financeManage/preview",// 结算预览
        component: "@/pages/financeManage/preview"
      },
    ]
  }
]
