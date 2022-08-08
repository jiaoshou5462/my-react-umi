import {
    crmCustomerInfoList,
    exportCrmCustomer,
    getActivityChannelList,
    getBranchInfo,
    getTeamInfo
  } from "@/services/customerManage"
  import {message} from "antd";
import { result } from "lodash";
  const model = {
    namespace: 'customerList',
    //默认数据
    state: {
      channelList: [], //渠道
      branchInfoList: [],
      teamInfoList: [],
    },
    //处理异步事件
    effects: {
      /*获取列表*/
      *getList({payload, callback},{put,call}){
        let response = yield call(crmCustomerInfoList, payload)
        callback && callback(response)
      },
      /*下载用户列表*/
      *exportCrmCustomer({payload, callback},{put,call}){
        let response = yield call(exportCrmCustomer, payload)
        callback && callback(response)
      },
       /*获取渠道列表*/
      *getActivityChannelList({payload, callback},{put,call}){
        let response = yield call(getActivityChannelList, payload)
        yield put({
          type: "setActivityChannelList",
          payload: response
        })
      },
    *getBranchInfo({payload, callback},{put,call}){
      let response = yield call(getBranchInfo, payload)
      yield put({
        type: "setGetBranchInfo",
        payload: response
      })
    },
     /*获取所属团队列表*/
     *getTeamInfo({payload, callback},{put,call}){
        let response = yield call(getTeamInfo, payload)
        yield put({
        type: "setGetTeamInfo",
        payload: response
      })
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
      setGetBranchInfo(state,{payload}){
        if(payload.result.code === '0'){
          state.branchInfoList = payload.body || []
          return {...state};
        }else{
          message.error(payload.result.message)
        }
      },
      setGetTeamInfo(state,{payload}){
        if(payload.result.code === '0'){
          state.teamInfoList = payload.body || []
          return {...state};
        }else{
          message.error(payload.result.message)
        }
      },
      resetTeamInfoList(state,{payload}){
        state.teamInfoList = []
        return {...state}
      }
    },
    //发布订阅事件
    subscriptions: {},
  };
  export default model;
  