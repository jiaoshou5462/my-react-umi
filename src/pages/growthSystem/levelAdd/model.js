
import { queryEquityManagementList, saveGrowLevel, queryGrowLevel, deletePrice } from "@/services/growth";
const model = {
  namespace: 'levelAdd',
  //默认数据
  state: {
  },
  //处理异步事件
  effects: {
    /*获取列表*/
    *queryEquityManagementList ({ payload, callback }, { put, call }) {
      const response = yield call(queryEquityManagementList, payload);
      callback && callback(response)
    },
    /*保存*/
    *saveGrowLevel ({ payload, callback }, { put, call }) {
      const response = yield call(saveGrowLevel, payload);
      callback && callback(response)
    },
    /*任务-回显*/
    *queryGrowLevel ({ payload, callback }, { put, call }) {
      let response = yield call(queryGrowLevel, payload)
      callback && callback(response)
    },
    /*任务-奖品删除*/
    *deletePrice ({ payload, callback }, { put, call }) {
      let response = yield call(deletePrice, payload)
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
