import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';


/*角色管理列表*/
export const queryRoleList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelRole/getRoleList`,
    ...payload
  })
};

/*角色新增*/
export const addRole = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelRole/addRole`,
    ...payload
  })
};

/*角色修改*/
export const putRole = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelRole/updateRole`,
    ...payload
  })
};

/*角色停用/启用*/
export const banRole = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelRole/banRole`,
    ...payload
  })
};

/*角色删除*/
export const delRole = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelRole/deleteRole/${payload.params.roleId}`,
    ...payload
  })
};

/*分配账号-查询已分配用户*/
export const getRoleUser = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserRole/getRoleUser`,
    ...payload
  })
};

/*分配账号-查询未分配用户*/
export const getChannelUser = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserRole/getChannelUser`,
    ...payload
  })
};

/*分配账号-修改账号*/
export const updateRoleUser = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserRole/updateRoleUser`,
    ...payload
  })
};

/*配置权限-查询菜单*/
export const getRoleMenuInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMenu/getRoleMenuInfo`,
    ...payload
  })
};

/*配置权限-编辑菜单*/
export const updateRoleMenu = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMenu/updateRoleMenu`,
    ...payload
  })
};

/*配置权限-设置-查询元素*/
export const getMenuElement = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMenu/getMenuElement`,
    ...payload
  })
};

/*配置权限-设置-提交元素*/
export const updateMenuElement = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMenu/updateMenuElement`,
    ...payload
  })
};





/*账号管理列表*/
export const queryUserList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUser/getUserList`,
    ...payload
  })
};

/*账号新增*/
export const addUser = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUser/addUser`,
    ...payload
  })
};

/*账号停用/启用*/
export const banUser = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUser/banUser`,
    ...payload
  })
};

/*账号修改*/
export const updateUser = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUser/updateUser`,
    ...payload
  })
};

/*分配角色-查询已分配角色*/
export const queryUserRole = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserRole/getUserRole`,
    ...payload
  })
};

/*分配角色-查询未分配角色*/
export const queryRoleInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserRole/getRoleInfo`,
    ...payload
  })
};

/*分配角色-账号分配角色提交*/
export const updateUserRole = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserRole/updateUserRole`,
    ...payload
  })
};
/*个人中心-修改密码*/
export const channelUserpPassword = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUser/password`,
    ...payload
  })
};
/*重置密码*/
export const passwordReset = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUser/password/reset/user/${payload.params.userId}`,
    ...payload
  })
};
/*强制修改密码*/
export const passwordInit = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUser/password/update/init`,
    ...payload
  })
};
//查询组织机构列表    
export const queryList = (payload)=> {
  return createApi({
    url: `${api}/api/channel-service/organization/queryList`,
    ...payload
  })
}
//删除组织机构    
export const deleteOrganization = (payload)=> {
  return createApi({
    url: `${api}/api/channel-service/organization/delete`,
    ...payload
  })
}

//查询组织机构详情    
export const detailOrganization = (payload)=> {
  return createApi({
    url: `${api}/api/channel-service/organization/detail`,
    ...payload
  })
}

//新增组织机构    
export const insertOrganization = (payload)=> {
  return createApi({
    url: `${api}/api/channel-service/organization/insert`,
    ...payload
  })
}

//编辑组织机构    
export const updateOrganization = (payload)=> {
  return createApi({
    url: `${api}/api/channel-service/organization/update`,
    ...payload
  })
}

//上级组织机构列表    
export const queryParentList = (payload)=> {
  return createApi({
    url: `${api}/api/channel-service/organization/queryParentList`,
    ...payload
  })
}




