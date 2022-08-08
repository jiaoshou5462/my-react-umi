import { queryTaskClassification, getAllChannel, saveTask, queryTask, deletePrice, queryCustomerChannelByChannelId } from "@/services/growth";
import { message } from "antd";
const model = {
  namespace: 'taskDetailst',
  //默认数据
  state: {
    classifyList: [],
    channelList: []
  },
  //处理异步事件
  effects: {
    /*分类获取*/
    *queryTaskClassification ({ payload, callback }, { call, put }) {
      const response = yield call(queryTaskClassification, payload);
      yield put({
        type: 'setQueryTaskClassification',
        payload: response,
      });
    },
    /*获取渠道列表*/
    *getAllChannel ({ payload, callback }, { put, call }) {
      let response = yield call(queryCustomerChannelByChannelId, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
    },
    /*保存任务事件*/
    *saveTask ({ payload, callback }, { put, call }) {
      let response = yield call(saveTask, payload)
      callback && callback(response)
    },
    /*任务事件回显*/
    *queryTask ({ payload, callback }, { put, call }) {
      let response = yield call(queryTask, payload)
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
    setQueryTaskClassification (state, { payload }) {
      if (payload.code === '0000') {
        state.classifyList = payload.items || []
        return { ...state };
      } else {
        message.error(payload.message)
      }
    },
    setActivityChannelList (state, { payload }) {
      if (payload.body.code === '000') {
        state.channelList = payload.body.data.channelList || [];
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
