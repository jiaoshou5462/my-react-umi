import {skuManagementList} from "@/services/preProduction";
import {message} from "antd";
const model = {
  namespace: 'relevanceProList',
  //默认数据
  state: {
    pageTotal: 1, //列表总数据
    list: [], //列表
  },
  //处理异步事件
  effects: {
    /*SKU列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(skuManagementList, payload)
      yield put({
        type: "setList",
        payload: response
      })
    },
  },
  //处理同步事件
  reducers: {
    setList(state,{payload}){
      if(payload.result.code === '0'){
        state.list = payload.body.list
        state.pageTotal = payload.body.total || 1
        return {...state};
      }else {
        message.error(payload.result.message)
      }
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
