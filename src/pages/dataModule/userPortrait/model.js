import { findCustomerDataList, findUserConversionAnalysisList, findUserActivityAnalysisList, findUserPortraiListTotalList, findSourcePersonList, findSexPersonList, findTop10CityList, findAgePersonList, findTop10ProvinceList, findCouponPreferenceList, findUserActivePeriodList, findActivityPreferenceList } from '@/services/tag';
import { message } from 'antd';
const Model = {
  namespace: 'userPortrait',
  state: {
  },
  effects: {
    //用户数量统计
    *findCustomerDataList ({ payload, callback }, { put, call }) {
      let response = yield call(findCustomerDataList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //转化率分析
    *findUserConversionAnalysisList ({ payload, callback }, { put, call }) {
      let response = yield call(findUserConversionAnalysisList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //用户活跃度分析
    *findUserActivityAnalysisList ({ payload, callback }, { put, call }) {
      let response = yield call(findUserActivityAnalysisList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //总统计
    *findUserPortraiListTotalList ({ payload, callback }, { put, call }) {
      let response = yield call(findUserPortraiListTotalList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //用户来源统计
    *findSourcePersonList ({ payload, callback }, { put, call }) {
      let response = yield call(findSourcePersonList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //性别分布
    *findSexPersonList ({ payload, callback }, { put, call }) {
      let response = yield call(findSexPersonList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //Top10城市
    *findTop10CityList ({ payload, callback }, { put, call }) {
      let response = yield call(findTop10CityList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //用户年龄分析
    *findAgePersonList ({ payload, callback }, { put, call }) {
      let response = yield call(findAgePersonList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    // Top10省份
    *findTop10ProvinceList ({ payload, callback }, { put, call }) {
      let response = yield call(findTop10ProvinceList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //卡券偏好
    *findCouponPreferenceList ({ payload, callback }, { put, call }) {
      let response = yield call(findCouponPreferenceList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //活动偏好
    *findActivityPreferenceList ({ payload, callback }, { put, call }) {
      let response = yield call(findActivityPreferenceList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //用户活跃时间段
    *findUserActivePeriodList ({ payload, callback }, { put, call }) {
      let response = yield call(findUserActivePeriodList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
  },
  reducers: {

  },
};
export default Model;
