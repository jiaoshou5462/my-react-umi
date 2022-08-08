import { saveEquityManagement, queryEquityManagement, download } from "@/services/growth";
const model = {
  namespace: 'addRight',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    /*保存事件*/
    *saveEquityManagement ({ payload, callback }, { put, call }) {
      let response = yield call(saveEquityManagement, payload)
      callback && callback(response)
    },
    /*回显*/
    *queryEquityManagement ({ payload, callback }, { put, call }) {
      let response = yield call(queryEquityManagement, payload)
      callback && callback(response)
    },
    /*图片下载回显*/
    *download ({ payload, callback }, { put, call }) {
      let response = yield call(download, payload)
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
