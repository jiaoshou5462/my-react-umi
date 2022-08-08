import {
  getSafetyInspectOrderDetail
} from '@/services/order'
import {message} from "antd";
const model = {
  namespace: 'safetyInspectOrderDetail',
  //默认数据
  state: {
    detail: {}, //代价订单详请
  },
  //处理异步事件
  effects: {
    /*代价订单详请*/
    *getDetail({payload, callback},{call,put}){
      let response = yield call(getSafetyInspectOrderDetail, payload)
      if(response.code === 'S000000') {
        yield put({
          type: "setDetail",
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
      state.detail =  payload.data
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
