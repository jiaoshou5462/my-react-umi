import {
  getProductOrderList
} from '@/services/order'
import {message} from "antd";
const model = {
  namespace: 'productOrderList',
  //默认数据
  state: {
    listData: {}, //列表
    list: [], //列表
    pageTotal: 0, //列表总数据
  },
  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getProductOrderList, payload)
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
      let temp = payload.body || {}
      state.listData = temp
      state.list = temp.productOrderInfoRsps || []
      state.pageTotal = temp.pageInfoVO.totalCount || 0
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
