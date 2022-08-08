
import {api} from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

//payload需传入方法以及参数等(url除外) 
export const getMetaInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMeta/`, //新的
    ...payload
  })
};

//查询标签时间，用户行为满足，下拉列表等数据   
export const getTagEvent = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelEvent/`,
    ...payload
  })
};
 
//查询用户群列表  
export const getUserGroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/search`,//新的
    ...payload
  })
};
  
  
  //查询用户群列表--下载   
  export const getDownload = (payload) => {
    return createApi({
      url: `${api}/api/file/download`,
      responseType: 'blob',
      ...payload
    })
  };

  //导入指定名单新建用户群   
export const postTagImport = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelUserGroup/import/`,
    ...payload
  })
};

//手动刷新   
export const putRefresh = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/refresh/${payload.id}`, //新的
    ...payload
  })
};
//客户名称   
export const getCustomerName = (payload) => {
  return createApi({
    url: `${api}/api/purchase/coupon/getAllChannel`,
    ...payload
  })
};

//查询导入用户群信息   
export const getAllImportUserGroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/import/${payload.id}`,// 新的
    ...payload
  })
};
//查询新建用户群信息   
export const getAllUserGroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/${payload.id}`,// 新的
    ...payload
  })
};

//修改导入用户群信息  
export const putAllImportUserGroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/import`, // 新的
    ...payload
  })
};

//修改创建用户群信息      
export const putAllUserGroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/`,//新的
    ...payload
  })
};

//校验用户群id是否唯一   (已弃用))
export const getCodeSole = (payload) => {
  return createApi({
    url: `${api}/api/tag/userGroup/unique/group-code/`+payload.groupCode,
    ...payload
  })
};

//校验用户群名字是否唯一   
export const getNameSole = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/unique/group-name/${payload.groupName}`, // 新的
    ...payload
  })
};

//用户群列表导出名单弹窗-列表查询，导出
export const exportUserGroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/export/user-group/${payload.userGroupId}`,
    ...payload
  })
};
//用户群列表导出名单弹窗-列表查询，导出
export const channelUserGroupTask = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/${payload.userGroupId}/task`,
    ...payload
  })
};
//标签群组 分级查询 get
export const channelGroupChannel = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGroup/channel`,
    ...payload
  })
};
//标签群组 二级下拉框
export const channelPredicateTag = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel-predicate/tag`,
    ...payload
  })
};
//标签群组 新增/修改
export const channelUserGroupTag = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/tag`,
    ...payload
  })
};
//标签群组 启用禁用
export const userGroupStop = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/stop`,
    ...payload
  })
};
//标签群组 调用场景
export const userGroupGetTagSceneById = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/getTagSceneByIds/${payload.userGroupId}`,
    ...payload
  })
};
