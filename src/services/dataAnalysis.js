import {api} from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/* 活动部分 */
// 获取正在进行的活动
export const queryConductActivity = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/queryConductActivity`,
    ...payload
  })
};

// 获取渠道基本信息
export const getChannelInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/getChannelInfo`,
    ...payload
  })
};

// 整体趋势
export const wholeTrendStatistics = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/wholeTrendStatistics`,
    ...payload
  })
};

// 活动任务
export const activitityTaskStatistics = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/activitityTaskStatistics`,
    ...payload
  })
};

// 活动转换漏斗
export const activitityTaskStatisticsSum = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/activitityTaskStatisticsSum`,
    ...payload
  })
};

// 获取活动奖品详情
export const prizeSection = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/prizeSection`,
    ...payload
  })
};

// 活动来源
export const activityLinkNums = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/activityLinkNums`,
    ...payload
  })
};

// 参与活动用户
export const newJudge = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/newJudge`,
    ...payload
  })
};

// 性别统计
export const sexSection = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/sexSection`,
    ...payload
  })
};

//年龄统计
export const ageSection = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/ageSection`,
    ...payload
  })
};

// 城市
export const activityCitySection = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/activityCitySection`,
    ...payload
  })
};

// 城市
export const activityProvinceSection = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/dashboard/activityProvinceSection`,
    ...payload
  })
};


/* 卡券部分 */

// 卡券发放统计
export const findCouponStatisticsList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findCouponStatisticsList`,
    ...payload
  })
};

// 发放统计总数
export const findTotalCouponStatisticsList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findTotalCouponStatisticsList`,
    ...payload
  })
};

// 卡券漏斗
export const findTotalCouponStatisticsListForName = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findTotalCouponStatisticsListForName`,
    ...payload
  })
};


// 发放渠道
export const findCouponSourceList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findCouponSourceList`,
    ...payload
  })
};

// 获得卡券用户数
export const findCouponUserList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findCouponUserList`,
    ...payload
  })
};

// 性别饼状图
export const findCouponUserSexList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findCouponUserSexList`,
    ...payload
  })
};

// 年龄柱状图
export const findCouponUserAgeList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findCouponUserAgeList`,
    ...payload
  })
};

// 省份
export const findCouponUserProvinceList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findCouponUserProvinceList`,
    ...payload
  })
};

// 城市

export const findCouponUserCityList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDashboard/findCouponUserCityList`,
    ...payload
  })
};