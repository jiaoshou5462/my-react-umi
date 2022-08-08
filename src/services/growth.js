import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';


/*任务-查询分类*/
export const queryTaskClassification = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/queryTaskClassification`,
    ...payload
  })
};
/*任务-保存分类*/
export const saveTaskClassification = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/saveTaskClassification`,
    ...payload
  })
};
/*任务-删除分类*/
export const deleteTaskClassification = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/deleteTaskClassification/${payload.id}`,
    ...payload
  })
};
/*任务-保存任务事件*/
export const saveTask = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/saveTask`,
    ...payload
  })
};
/*任务-任务列表*/
export const queryTaskList = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/queryTaskList`,
    ...payload
  })
};

/*任务-删除任务*/
export const deleteTask = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/deleteTask/${payload.id}`,
    ...payload
  })
};
/*任务-启用/停用*/
export const updateTaskStatus = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/updateTaskStatus`,
    ...payload
  })
};
/*任务-启用/停用*/
export const queryTask = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/queryTask`,
    ...payload
  })
};
/*任务-奖品删除*/
export const deletePrice = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/deletePrice`,
    ...payload
  })
};
/*任务-查询用户基础信息*/
export const queryUserData = (payload) => {
  return createApi({
    url: `${api}/api/growth/growth/queryUserData`,
    ...payload
  })
};
//活动2-奖池及中奖率-选择奖品-卡券套餐列表
export const getCouponList = (payload) => {
  return createApi({
    url: `${api}/api/purchase/quotation/selectChannelCoupon`,
    ...payload
  })
}
/*获取当前活动的 渠道权限*/
export const getChannelAuthority = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/activityCustomer/queryChannelPoints`,
    ...payload
  })
}
/*活动列表 - 获取渠道*/
export const getActivityChannelList = (payload) => {
  return createApi({
    url: `${api}/api/growthService/LonginCustomer/customerChannelList`,
    ...payload
  })
}
/*查询所有渠道接口*/
export const getAllChannel = (payload) => {
  return createApi({
    url: `${api}/octopus/coupon/getAllChannel`,
    ...payload
  })
};

/*图片上传*/
export const uploadIcon = `${api}/api/growth/growthLevel/uploadIcon`;

/*权益-保存*/
export const saveEquityManagement = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/saveEquityManagement`,
    ...payload
  })
};
/*权益-列表*/
export const queryEquityManagementList = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/queryEquityManagementList`,
    ...payload
  })
};
/*权益-回显*/
export const queryEquityManagement = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/queryEquityManagement`,
    ...payload
  })
};
/*权益-删除*/
export const deleteEquityManagement = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/deleteEquityManagement/${payload.id}`,
    ...payload
  })
};

// 文件下载
export const download = (payload) => {
  return createApi({
    url: `${api}/api/file/download?fileCode=${payload.fileCode}`,
    ...payload
  })
};

// 图片上传
export const uploadImg = `${api}/api/file/upload?folderCode=sale_customer`;
// 图片显示
export const downloadImg = `${api}/api/file/download?fileCode=`;


/*等级-保存*/
export const saveGrowLevel = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/saveGrowLevel`,
    ...payload
  })
};
/*等级-删除*/
export const deleteGrowLevel = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/deleteGrowLevel/${payload.id}`,
    ...payload
  })
};
/*等级-列表*/
export const queryGrowLevelList = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/queryGrowLevelList`,
    ...payload
  })
};
/*等级-更改状态*/
export const updateGrowLevelStatus = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/updateGrowLevelStatus`,
    ...payload
  })
};
/*等级-回显*/
export const queryGrowLevel = (payload) => {
  return createApi({
    url: `${api}/api/growth/growthLevel/queryGrowLevel`,
    ...payload
  })
};

/*渠道获取*/
export const queryCustomerChannelByChannelId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/queryCustomerChannelByChannelId`,
    ...payload
  })
};