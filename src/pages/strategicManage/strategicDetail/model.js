
import {
  queryStrategyDetail,
  queryStrategyDetailList
} from "@/services/strategicManage"
const model = {
  namespace: 'strategicDetail',
  //默认数据
  state: {
    firstStepData:{}
  },
  //处理异步事件
  effects: {
    /*获取策略详情*/
    *queryStrategyDetail({payload, callback},{put,call}){
      let response = yield call(queryStrategyDetail, payload)
      callback && callback(response)
    },
    /*获取策略详情列表*/
    *queryStrategyDetailList({payload, callback},{put,call}){
      let response = yield call(queryStrategyDetailList, payload)
      callback && callback(response)
    },
},
  //处理同步事件
  reducers: {
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
