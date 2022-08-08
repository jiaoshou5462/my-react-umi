export default[
  {
    path: '/insuranceSuper',
    name: '保险超市商品配置',
    routes:[
      {
        path: '/insuranceSuper/supermarket',
        name: '保险超市商品配置',
        component: "@/pages/insuranceSuper/supermarket",
      }, {
        path: '/insuranceSuper/supermarket/product',
        name: '保险超市商品',
        component: "@/pages/insuranceSuper/product"
      }, {
        path: '/insuranceSuper/supermarket/insuranceProduct',
        name: '保险产品',
        component: "@/pages/insuranceSuper/insuranceProduct"
      },
    ]
  }
]

