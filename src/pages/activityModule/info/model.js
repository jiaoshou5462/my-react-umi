import {
  getActivityThrong,
  saveMarketingInfo,
  backStageSActivityOne,
  getActivityChannelList,
  getListMarketProject,
} from "@/services/activity";
import {message} from "antd";
const Model = {
  namespace: 'activityNumber',
  state: {
    subimtCode: '',
    channelList: [], //渠道
  },
  effects: {
  *saveMarketingInfo({ payload ,callback}, { put,call }){
      let response = yield call(saveMarketingInfo,payload);
      if(response.result.code === '0'){
        callback && callback(response)
      }else {
        message.error(response.result.message)
      }
    },
    //数据填充
    *backStageSActivityOne({ payload ,callback}, { put,call }){
      let response = yield call(backStageSActivityOne,payload);
      if(response.result.code === '0'){
        callback && callback(response)
      }
    },
    //所属项目
    *getListMarketProject({ payload ,callback}, { put,call }){
      let response = yield call(getListMarketProject,payload);
      if(response.result.code === '0'){
        callback && callback(response)
      }
    },
    /*获取渠道列表*/
    *getActivityChannelList({payload, callback},{put,call}){
      let response = yield call(getActivityChannelList, payload)
      yield put({
        type: "setActivityChannelList",
        payload: response
      })
    },
    //获取以保存的活动人群列表
    *getActivityThrong({ payload, callback }, { put,call }){
      let response = yield call(getActivityThrong, payload);
      callback && callback(response)
    },
  },
  reducers: {
    setInfoData(state,{payload}){
      state.subimtCode = payload
      return {...state};
    },
    setActivityChannelList(state,{payload}){
      if(payload.code === '0000'){
        state.channelList = payload.items.data.channelList || []
        return {...state};
      }else {
        message.error(payload.message)
      }
    },
  },
};
export default Model;
