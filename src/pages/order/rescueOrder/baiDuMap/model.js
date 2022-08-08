import {
  getLoadCaseTimeline,
  getCasePolylineSearch,
  getLoadArrivedPointIndex,
} from '@/services/order'
import {message} from "antd";
const model = {
  namespace: 'baiDuMap',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    /*案件多段线搜索*/
    *getCasePolylineSearch({payload, callback},{call,put}){
      let response = yield call(getCasePolylineSearch, payload)
      if(response.result.code === '0') {
        callback && callback (response.body || [])
      }else {
        message.error(response.result.message)
      }
    },
    /*加载到达点的index*/
    *getLoadArrivedPointIndex({payload, callback},{call,put}){
      let response = yield call(getLoadArrivedPointIndex, payload)
      if(response.result.code === '0') {
        callback && callback (response.body)
      }else {
        message.error(response.result.message)
      }
    },
      /*加载案件时间线*/
    *getLoadCaseTimeline({payload, callback},{call,put}){
      let response = yield call(getLoadCaseTimeline, payload)
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
