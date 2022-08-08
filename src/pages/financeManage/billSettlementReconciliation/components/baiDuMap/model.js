import {
  loadCaseTimeline,
  casePolylineSearch,
  loadArrivedPointIndex,
} from '@/services/finance'
import {message} from "antd";
const model = {
  namespace: 'financeMap',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    /*案件多段线搜索*/
    *getCasePolylineSearch({payload, callback},{call,put}){
      let response = yield call(casePolylineSearch, payload)
      if(response.result.code === '0') {
        callback && callback (response.body || [])
      }else {
        message.error(response.result.message)
      }
    },
    /*加载到达点的index*/
    *getLoadArrivedPointIndex({payload, callback},{call,put}){
      let response = yield call(loadArrivedPointIndex, payload)
      if(response.result.code === '0') {
        callback && callback (response.body)
      }else {
        message.error(response.result.message)
      }
    },
      /*加载案件时间线*/
    *getLoadCaseTimeline({payload, callback},{call,put}){
      let response = yield call(loadCaseTimeline, payload)
      if(response.result.code === '0') {
        callback && callback (response.body)
      }else {
        message.error(response.result.message)
      }
    },

  },
  //处理同步事件
  reducers: {

  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
