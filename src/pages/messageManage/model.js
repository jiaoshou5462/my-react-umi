import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import {
  getMessageManagerList,
  getReadMessage
} from "@/services/message";

const model = {
  namespace: 'messageModel',
  //默认数据
  state: {
    importantMsgList: [],//重要讯息列表
    importantMsgTotal: null,//重要讯息列表总数
    type: null,//分类（讯息，系统）
  },

  //处理异步事件
  effects: {
    // 消息列表
    *messageManagerList({ payload, callback }, { call, put }) {
      let response = yield call(getMessageManagerList, payload)
      // console.log(response, 'detaillist')
      yield put({
        type: 'setMessageManagerList',
        payload: response.body
      })
      callback && callback(response)
    },
    *readMessage({ payload, callback }, { call, put }) {
      let response = yield call(getReadMessage, payload)
      // console.log(response, 'detaillist')
      yield put({
        type: 'setReadMessage',
        payload: response.body
      })
      callback && callback(response)
    },


  },

  //处理同步事件
  reducers: {
    setMessageManagerList(state, action) {
      // console.log(action, '列表QQQ')
      return {
        ...state,
        importantMsgList: action.payload.list,
        importantMsgTotal: action.payload.total
      };
    },
    setMsgTabs(state, action) {
      return { ...state, type: action.payload };
    },
    setReadMessage(state, action) {
      return {
        ...state,
      };
    },
  },

  //发布订阅事件
  subscriptions: {

  },
};
export default model;