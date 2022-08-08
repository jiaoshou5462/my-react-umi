//应付及发票管理
export default [
  {
    path: "/payableInvoices",
    name: "应付及发票管理",
    icon: 'AccountBookOutlined',
    routes: [
      {
        path: '/payableInvoices/list',//列表
        name: '应付及发票列表',
        icon: '',
        component: "@/pages/payableInvoices"
      },
      {
        path: "/payableInvoices/list/invoicesDetail",//发票详情
        component: "@/pages/payableInvoices/invoicesDetail"
      },
      {
        path: "/payableInvoices/list/payableDetail",//付款详情
        component: "@/pages/payableInvoices/payableDetail"
      },
    ]
  }
]
