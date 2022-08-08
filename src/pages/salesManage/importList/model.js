import {
  onDownloadFile,
  addFileTaskInfo,
  getFileTaskList,
  getActivityChannelList
} from "@/services/salesOrder"
import {message} from "antd";
const model = {
  namespace: 'importList',
  //默认数据
  state: {
    fileTaskList: [], //列表
    channelList: [], //渠道
    pageTotal: 1
  },
  //处理异步事件
  effects: {
    /*上传销售客户文件*/
    *addFileTaskInfo({payload, callback},{put,call}){
      let response = yield call(addFileTaskInfo, payload)
      callback && callback(response)
    },
    /*获取列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getFileTaskList, payload)
      yield put({
        type: "setList",
        payload: response
      })
    },
    /*获取渠道列表*/
    *getActivityChannelList({payload, callback},{put,call}){
      let response = yield call(getActivityChannelList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
    },
    /*下载excel*/
    *onDownloadFile({payload, callback},{put,call}){
      let response = yield call(onDownloadFile, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setList(state,{payload}){
      if(payload.result.code === '0'){
        let temp = payload.body || {}
        state.pageTotal = temp.total || 1
        state.fileTaskList = temp.list || []
        return {...state};
      }else {
        message.error(payload.message)
      }
    },
    setActivityChannelList(state,{payload}){
      if(payload.code === '0000'){
        state.channelList = payload.items.data || []
        return {...state};
      }else {
        message.error(payload.message)
      }
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
