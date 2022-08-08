import {
  getChannelInfo,
  findCouponStatisticsList,
  findTotalCouponStatisticsList,
  findCouponSourceList,
  findCouponUserList,
  findCouponUserSexList,
  findCouponUserAgeList,
  findCouponUserProvinceList,
  findCouponUserCityList,
  findTotalCouponStatisticsListForName
} from "@/services/dataAnalysis"
import {message} from "antd";
import { result } from "lodash";
const model = {
  namespace: 'cardDataAnalysis',
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

    //卡券部分
    /* 卡券发放统计 */
    *findCouponStatisticsList({payload, callback},{put,call}){
      let response = yield call(findCouponStatisticsList, payload)
      callback && callback(response)
      return response
    },
    /* 卡券发放统计 */
    *findTotalCouponStatisticsList({payload, callback},{put,call}){
      let response = yield call(findTotalCouponStatisticsList, payload)
      callback && callback(response)
    },
     /* 发放渠道 */
    *findCouponSourceList({payload, callback},{put,call}){
      let response = yield call(findCouponSourceList, payload)
      callback && callback(response)
    },
     /* 获得卡券用户数 */
    *findCouponUserList({payload, callback},{put,call}){
      let response = yield call(findCouponUserList, payload)
      callback && callback(response)
    },
     /* 性别饼状图 */
    *findCouponUserSexList({payload, callback},{put,call}){
      let response = yield call(findCouponUserSexList, payload)
      callback && callback(response)
    },
     /* 年龄柱状图 */
    *findCouponUserAgeList({payload, callback},{put,call}){
      let response = yield call(findCouponUserAgeList, payload)
      callback && callback(response)
    },
    /* 省份 */
    *findCouponUserProvinceList({payload, callback},{put,call}){
      let response = yield call(findCouponUserProvinceList, payload)
      callback && callback(response)
    },
     /* 省份 */
     *findCouponUserCityList({payload, callback},{put,call}){
      let response = yield call(findCouponUserCityList, payload)
      callback && callback(response)
    },
    *findTotalCouponStatisticsListForName({payload, callback},{put,call}){
      let response = yield call(findTotalCouponStatisticsListForName, payload)
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
