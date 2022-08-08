//弹窗触达
export default [
  {
    path: "/popupTouchManage",
    name: "弹窗触达",
    icon: 'CreditCardOutlined',
    routes: [
      {
        path: "/popupTouchManage/directionalPopup",//定向弹窗
        name: '定向弹窗',
        component: "@/pages/popupTouchManage/directionalPopup"
      },
      {
        path: '/popupTouchManage/directionalPopup/addEditDirection',//新建定向弹窗
        name: '新建弹窗',
        component: "@/pages/popupTouchManage/directionalPopup/addEditDirection"
      },
      {
        path: '/popupTouchManage/popupContent',//弹窗内容
        name: '弹窗内容',
        component: "@/pages/popupTouchManage/popupContent",
      },
      {
        path: '/popupTouchManage/popupContent/addEditContent',
        name: '新建弹窗内容',
        component: "@/pages/popupTouchManage/popupContent/addEditContent"
      },
      {
        path: "/popupTouchManage/touchRecord",//触达记录
        name: '触达记录',
        component: "@/pages/popupTouchManage/touchRecord"
      },
    ]
  }
]
