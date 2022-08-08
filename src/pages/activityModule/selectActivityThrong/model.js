import {
  getThrongListES,
  getThrongListExclude,
} from "@/services/activity"
const model = {
  namespace: 'selectActivityThrong',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    //获取可参与人群列表
    *getThrongListES({ payload, callback }, { put,call }){
      let response = yield call(getThrongListES, payload);
      callback && callback(response)
    },
    //获取排除人群列表
    *getThrongListExclude({ payload, callback }, { put,call }){
      let response = yield call(getThrongListExclude, payload);
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
