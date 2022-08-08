import {
  getThrongList,getChannelType
} from "@/services/activity"
const model = {
  namespace: 'selectThrong',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    //获取人群列表
    *getCrowdList({ payload, callback }, { put,call }){
      let response = yield call(getThrongList, payload);
      callback && callback(response)
    },
    //获取渠道类型
    *getChannelType({ payload, callback }, { put,call }){
      let response = yield call(getChannelType, payload);
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
