import {
  getProductTag,
} from "@/services/insurance"
import {message} from "antd"
const model = {
  namespace: 'productTagModal',
  //默认数据
  state: {
    productTagList: []
  },
  //处理异步事件
  effects: {
    *getProductTag({payload, callback},{call,put}){
      let response = yield call(getProductTag, payload)
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
      state.productTagList =  payload.body
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
