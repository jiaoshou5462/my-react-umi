
import {
  queryWanderList,
  deleteWander,
  updateStatus
} from "@/services/strategicManage"
import {message} from "antd";
const model = {
  namespace: 'strategicList',
  //默认数据
  state: {
    firstStepData:{}
  },
  //处理异步事件
  effects: {
    /*获取策略列表*/
    *queryWanderList({payload, callback},{put,call}){
      let response = yield call(queryWanderList, payload)
      callback && callback(response)
    },
    /*删除策略列表*/
    *deleteWander({payload, callback},{put,call}){
      let response = yield call(deleteWander, payload)
      callback && callback(response)
    },
    /*更新列表状态*/
    *updateStatus({payload, callback},{put,call}){
      let response = yield call(updateStatus, payload)
      callback && callback(response)
    }
},
  //处理同步事件
  reducers: {
    setFirstStepData(state,{payload}){
      state.firstStepData = payload
      return {...state};
      
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
