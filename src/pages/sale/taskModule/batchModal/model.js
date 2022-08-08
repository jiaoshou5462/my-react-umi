import {
  getTaskCustomerCrowdList
} from '@/services/saleTask'
import {message} from "antd";
const model = {
  namespace: 'batchModal',
  //默认数据
  state: {
    list: [], //批次列表
  },
  //处理异步事件
  effects: {
    /*查询客户人群批次列表*/
    *getList({payload, callback},{call,put}){
      let response = yield call(getTaskCustomerCrowdList, payload)
      if(response.result.code === '0') {
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
      state.list = payload.body || []
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
