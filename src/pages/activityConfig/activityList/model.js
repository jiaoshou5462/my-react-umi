import {
  getActivityList,
  onDeleteActivity,
  updateActivityStatus,
  downloadActivityExcel,
  getActivityChannelList,
  getListMarketProject,
  exportAnswer,
  exportQuestionnaire,
  queryMarketTypeList,
  downloadResendExcel,
  resendPrize
} from "@/services/activity"
import {message} from "antd";
const model = {
  namespace: 'activityList',
  //默认数据
  state: {
    channelList: [], //渠道
  },
  //处理异步事件
  effects: {
    /*获取列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getActivityList, payload)
      callback && callback(response)
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
    /*删除活动*/
    *onDeleteActivity({payload, callback},{put,call}){
      let response = yield call(onDeleteActivity, payload)
      callback && callback(response)
    },
    /*修改活动状态*/
    *updateActivityStatus({payload, callback},{put,call}){
      let response = yield call(updateActivityStatus, payload)
      callback && callback(response)
    },
    /*下载中奖名单excel*/
    *downloadActivityExcel({payload, callback},{put,call}){
      let response = yield call(downloadActivityExcel, payload)
      callback && callback(response)
    },
    /*导出答题数据报文*/
    *exportAnswer({payload, callback},{put,call}){
      let response = yield call(exportAnswer, payload)
      callback && callback(response)
    },
    /*导出问卷调查数据报文*/
    *exportQuestionnaire({payload, callback},{put,call}){
      let response = yield call(exportQuestionnaire, payload)
      callback && callback(response)
    },
    /*获取活动类型*/
    *queryMarketTypeList({payload, callback},{put,call}){
      let response = yield call(queryMarketTypeList,payload);
      callback && callback(response)
    },
    /*下载卡券发放失败明细*/
    *downloadResendExcel({payload, callback},{put,call}){
      let response = yield call(downloadResendExcel, payload)
      callback && callback(response)
    },
    /*确认补发卡券*/
    *resendPrize({payload, callback},{put,call}){
      let response = yield call(resendPrize, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
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
