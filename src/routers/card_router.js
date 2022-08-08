//卡券
export default [
  {
    path: "/card",
    name: "卡券",
    icon: 'AccountBookOutlined',
    routes: [
      {
        path: '/card/cardDetailList',
        name: '卡券明细查询',
        icon: '',
        component: "@/pages/card/cardDetailList"
      },
    ]
  }
]
