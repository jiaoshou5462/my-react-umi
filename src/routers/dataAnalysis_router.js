export default[
  {
    path: "/dataAnalysis",
    name: "数据",
    icon: '',
    routes: [
      {
        path: '/dataAnalysis/activityDataAnalysis',
        name: '活动数据分析',
        icon: '',
        component: "@/pages/dataAnalysis/activityDataAnalysis"
      },
      {
        path: '/dataAnalysis/cardDataAnalysis',
        name: '卡券数据分析',
        icon: '',
        component: "@/pages/dataAnalysis/cardDataAnalysis"
      },
    ]
  }
]