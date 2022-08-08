import {
  getChannelInfo,
  wholeTrendStatistics,
  activitityTaskStatistics,
  activitityTaskStatisticsSum,
  activityLinkNums,
  newJudge,
  sexSection,
  activityCitySection,
  activityProvinceSection,
  queryConductActivity,
  ageSection,
  prizeSection
} from "@/services/dataAnalysis"
import {message} from "antd";
import { result } from "lodash";
const model = {
  namespace: 'activityDataAnalysis',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    /* 获取渠道基本信息 */
    *getChannelInfo({payload, callback},{put,call}){
      let response = yield call(getChannelInfo, payload)
      callback && callback(response)
    },
    /*获取列表*/
    *wholeTrendStatistics({payload, callback},{put,call}){
      let response = yield call(wholeTrendStatistics, payload)
      callback && callback(response)
    },
    /*获取活动任务列表*/
    *activitityTaskStatistics({payload, callback},{put,call}){
      let response = yield call(activitityTaskStatistics, payload)
      callback && callback(response)
    },

    *activitityTaskStatisticsSum({payload, callback},{put,call}){
      let response = yield call(activitityTaskStatisticsSum, payload)
      callback && callback(response)
    },

    *activityLinkNums({payload, callback},{put,call}){
      let response = yield call(activityLinkNums, payload)
      callback && callback(response)
    },
    *newJudge({payload, callback},{put,call}){
      let response = yield call(newJudge, payload)
      callback && callback(response)
    },
    *sexSection({payload, callback},{put,call}){
      let response = yield call(sexSection, payload)
      callback && callback(response)
    },
    *activityCitySection({payload, callback},{put,call}){
      let response = yield call(activityCitySection, payload)
      callback && callback(response)
    },
    *activityProvinceSection({payload, callback},{put,call}){
      let response = yield call(activityProvinceSection, payload)
      callback && callback(response)
    },
    *queryConductActivity({payload, callback},{put,call}){
      let response = yield call(queryConductActivity, payload)
      callback && callback(response)
    },
    *ageSection({payload, callback},{put,call}){
      let response = yield call(ageSection, payload)
      callback && callback(response)
    },
    *prizeSection({payload, callback},{put,call}){
      let response = yield call(prizeSection, payload)
      callback && callback(response)
    }
  },
  //处理同步事件
  reducers: {
    
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
