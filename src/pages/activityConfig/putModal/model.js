import {
  getActivityLink,
  getActivityLinkList,
  saveActivityThrowIn
} from "@/services/activity"
const model = {
  namespace: 'putModal',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    /*获取列表*/
    *getActivityLink({payload, callback},{put,call}){
      let response = yield call(getActivityLink, payload)
      callback && callback(response)
    },
     /*获取投放列表*/
    *getActivityLinkList({payload, callback},{put,call}){
      let response = yield call(getActivityLinkList, payload)
      callback && callback(response)
    },
     /*保存投放*/
     *saveActivityThrowIn({payload, callback},{put,call}){
      let response = yield call(saveActivityThrowIn, payload)
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
