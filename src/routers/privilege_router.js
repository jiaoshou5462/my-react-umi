//权限管理 &个人中心
export default [
  {
    path: "/privilegeManage",
    name: "权限管理",
    icon: 'TeamOutlined',
    routes: [
      {
        path: '/privilegeManage/role',//角色管理
        name: '角色管理',
        icon: '',
        component: "@/pages/privilegeManage/role"
      },
      {
        path: '/privilegeManage/account',//账号管理
        name: '账号管理',
        icon: '',
        component: "@/pages/privilegeManage/account"
      },
    ]
  },
  {
    path: "/personalCenter",
    name: "个人中心",
    icon: 'TeamOutlined',
    routes: [
      {
        path: '/personalCenter/changePassword',//修改密码
        name: '修改密码',
        icon: '',
        component: "@/pages/personalCenter/changePassword"
      },
      {
        path: '/personalCenter/combination',//组织结构
        name: '组织结构',
        icon: '',
        component: "@/pages/personalCenter/combination"
      },
    ]
  },
  {
    path: '/messageManage/msgCenter',// 重要讯息，系统通知
    name: '消息中心',
    icon: '',
    component: "@/pages/messageManage"
  },
]