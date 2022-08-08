import {
  getEmaintOrderDetail
} from '@/services/order'
import {message} from "antd";
const model = {
  namespace: 'eMaintOrderDetail',
  //默认数据
  state: {
    detail: {}, //订单详请
  },
  //处理异步事件
  effects: {
    /*代价订单详请*/
    *getDetail({payload, callback},{call,put}){
      let response = yield call(getEmaintOrderDetail, payload)
      if(response.result.code === '0') {
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
      state.detail = payload.body 
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
