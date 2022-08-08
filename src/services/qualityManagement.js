/*
 * @Author: wangzhushan
 * @Date: 2022-05-07 17:27:03
 * @LastEditTime: 2022-05-10 20:34:22
 * @LastEditors: wangzhushan
 * @Description: 品质管理
 */
import {api} from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/*************************************************投诉管理********************************************************/ 
// 不分页查询投诉来源
export const queryComplainQueryComplain = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/complain/queryComplain`,
    ...payload
  })
};

// 分页查询投诉管理列表
export const queryComplainPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/complain/page`,
    ...payload
  })
};

// 投诉管理导出
export const queryComplainExport = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/complain/export`,
    ...payload
  })
};

// 查询当月投诉管理数据
export const queryComplainMouth = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/complain/queryComplainMouth`,
    ...payload
  })
};


/*************************************************评价管理********************************************************/ 
// 查询当月评价数据
export const queryDriverAssessMouth = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/driverAssess/queryAssessMouth`,
    ...payload
  })
};

// 分页查询评价管理列表
export const queryDriverAssessPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/driverAssess/page`,
    ...payload
  })
};

// 管理导出
export const queryDriverAssessExport = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/driverAssess/export`,
    ...payload
  })
};

// 不分页查询服务项目
export const queryDriverAssessQueryType = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/driverAssess/queryType`,
    ...payload
  })
};