import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import {
  getMessageList,
  getMessageDetail,
} from "@/services/officialAccount";
const model = {
  namespace: 'messageHistory',
  //默认数据
  state: {
  },

  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({ payload, callback }, { put, call }) {
      let response = yield call(getMessageList, payload)
      callback && callback(response)

    },
    /*获取列表详情*/
    *getListDetail({ payload, callback }, { put, call }) {
      let response = yield call(getMessageDetail, payload)
      callback && callback(response)
    },
  },

  //处理同步事件
  reducers: {

  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;