import { queryEquityManagementList, deleteEquityManagement } from "@/services/growth";
import { message } from "antd";
const model = {
  namespace: 'rightList',
  //默认数据
  state: {
    list: []
  },
  //处理异步事件
  effects: {
    /*获取列表*/
    *queryEquityManagementList ({ payload, callback }, { put, call }) {
      const response = yield call(queryEquityManagementList, payload);
      yield put({
        type: "setQueryEquityManagementList",
        payload: response
      })
    },
    /*删除*/
    *deleteEquityManagement ({ payload, callback }, { put, call }) {
      let response = yield call(deleteEquityManagement, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setQueryEquityManagementList (state, { payload }) {
      if (payload.code === '0000') {
        state.list = payload.items.list || [];
        return { ...state };
      } else {
        message.error(payload.message)
      }
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
