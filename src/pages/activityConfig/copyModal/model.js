import {
  copyActivity,
} from "@/services/activity"
const model = {
  namespace: 'copyModal',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    /*复制*/
    *copyActivity({payload, callback},{put,call}){
      let response = yield call(copyActivity, payload)
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
