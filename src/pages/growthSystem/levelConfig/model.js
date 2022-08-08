import { queryGrowLevelList, deleteGrowLevel, updateGrowLevelStatus } from "@/services/growth";
import { message } from "antd";
const model = {
  namespace: 'levelConfig',
  //默认数据
  state: {
    list: []
  },
  //处理异步事件
  effects: {
    /*获取列表*/
    *queryGrowLevelList ({ payload, callback }, { put, call }) {
      const response = yield call(queryGrowLevelList, payload);
      yield put({
        type: "setQueryGrowLevelList",
        payload: response
      })
    },
    /*删除*/
    *deleteGrowLevel ({ payload, callback }, { put, call }) {
      let response = yield call(deleteGrowLevel, payload)
      callback && callback(response)
    },
    /*更改状态*/
    *updateGrowLevelStatus ({ payload, callback }, { put, call }) {
      let response = yield call(updateGrowLevelStatus, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setQueryGrowLevelList (state, { payload }) {
      if (payload.code === '0000') {
        let toList = payload.items;
        toList = toList.map((item, i) => { item.key = i + 1; return item; })
        state.list = toList;

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
