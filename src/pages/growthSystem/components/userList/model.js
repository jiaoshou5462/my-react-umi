
import { queryUserData } from "@/services/growth";
import { message } from "antd";
const model = {
  namespace: 'userList',
  //默认数据
  state: {
    list: []
  },
  //处理异步事件
  effects: {
    /*用户信息列表*/
    *queryUserData ({ payload, callback }, { call, put }) {
      const response = yield call(queryUserData, payload);
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
