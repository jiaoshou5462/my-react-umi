import {
  getAgentOrderList
} from '@/services/order'
import {message} from "antd";
const model = {
  namespace: 'agentOrderList',
  //默认数据
  state: {
    list: [], //列表
    pageTotal: 0, //列表总数据
  },
  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getAgentOrderList, payload)
      if(response.code === 'S000000') {
        yield put({
          type: "setList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
  },
  //处理同步事件
  reducers: {
    setList(state,{payload}){
      state.list = payload.data || []
      state.pageTotal = payload.pageInfo.totalCount || 0
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
