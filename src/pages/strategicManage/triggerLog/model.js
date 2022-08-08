
import {
  queryTriggerConfigList,
  queryTriggerRecordList
} from "@/services/strategicManage"
const model = {
  namespace: 'triggerLog',
  state:{},
  //处理异步事件
  effects: {
    /*触发场景下拉*/
    *queryTriggerConfigList({payload, callback},{put,call}){
      let response = yield call(queryTriggerConfigList, payload)
      callback && callback(response)
    },
    /*触发记录详情列表*/
    *queryTriggerRecordList({payload, callback},{put,call}){
      let response = yield call(queryTriggerRecordList, payload)
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
