import { queryTaskClassification, saveTaskClassification, deleteTaskClassification, getAllChannel, queryTaskList, deleteTask, updateTaskStatus, queryCustomerChannelByChannelId } from "@/services/growth";
import { message } from "antd";
const model = {
  namespace: 'taskManages',
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
    /*新增、修改分类*/
    *saveTaskClassification ({ payload, callback }, { put, call }) {
      let response = yield call(saveTaskClassification, payload)
      callback && callback(response)
    },
    /*删除分类*/
    *deleteTaskClassification ({ payload, callback }, { put, call }) {
      let response = yield call(deleteTaskClassification, payload)
      callback && callback(response)
    },
    /*获取渠道列表*/
    *getAllChannel ({ payload, callback }, { put, call }) {
      let response = yield call(queryCustomerChannelByChannelId, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
    },
    /*任务列表*/
    *queryTaskList ({ payload, callback }, { call, put }) {
      const response = yield call(queryTaskList, payload);
      callback && callback(response)
    },
    /*删除任务*/
    *deleteTask ({ payload, callback }, { put, call }) {
      let response = yield call(deleteTask, payload)
      callback && callback(response)
    },
    /*任务-状态修改*/
    *updateTaskStatus ({ payload, callback }, { call, put }) {
      const response = yield call(updateTaskStatus, payload);
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
