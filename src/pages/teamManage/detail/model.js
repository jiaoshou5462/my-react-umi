import {
  getTeamDetail,
  getTeamSaleList,
  getCustomerList,
} from '@/services/team'
import {
  crmCustomerTagCountList
} from "@/services/sales";
import {message} from "antd";
const model = {
  namespace: 'teamManageDetail',
  //默认数据
  state: {
    taskDetail: {}, //任务数据详请
    teamDetail: {}, //团队数据详请
    tagCountList: [],
    saleList: [],
    saleTotal: 0,
    customerList: [],
    customerTotal: 0,
  },
  //处理异步事件
  effects: {
    /*详情*/
    *getDetail({payload, callback},{call,put}){
      let response = yield call(getTeamDetail, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setDetail",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*团员列表*/
    *getTeamSaleList({payload, callback},{call,put}){
      let response = yield call(getTeamSaleList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setTeamSaleList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
      /*客户列表*/
    *getCustomerList({payload, callback},{call,put}){
      let response = yield call(getCustomerList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setCustomerList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    // 标签列表
    *getCrmCustomerTagCountList({ payload, callback }, { call, put }) {
      let response = yield call(crmCustomerTagCountList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setCrmCustomerTagCountList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },

  },
  //处理同步事件
  reducers: {
    setDetail(state,{payload}){
      state.taskDetail =  payload.body.task || {}
      state.teamDetail =  payload.body.teamDetail || {}
      return {...state};
    },
    setTeamSaleList(state,{payload}){
      state.saleList =  payload.body.teamSaleLists || []
      state.saleTotal =  payload.body.total || 1
      return {...state};
    },
    setCustomerList(state,{payload}){
      state.customerList =  payload.body.rows || []
      state.customerTotal =  payload.body.total || 1
      return {...state};
    },
    setCrmCustomerTagCountList(state, {payload}) {
      let temp = payload.body || []
      temp.map((item, key) => {
        item.key = key
        item.status = false
      })
      state.tagCountList = temp
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
