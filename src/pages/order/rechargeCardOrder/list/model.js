import {
  getRechargeCardOrderList
} from '@/services/order'
import { message } from "antd";
const model = {
  namespace: 'rechargeCardOrderList',
  //默认数据
  state: {
    list: [], //列表
    listInfo: {}, //列表总数据

  },
  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({ payload, callback }, { put, call }) {
      let response = yield call(getRechargeCardOrderList, payload)
      if (response.code === 'S000000') {
        yield put({
          type: "setList",
          payload: response
        })
      } else {
        message.error(response.result.message)
      }
    },
  },
  //处理同步事件
  reducers: {
    setList(state, { payload }) {
      let objectId1 = ''
      let newList = payload.data.map(v => {
        objectId1 = v.orderInfo.objectId
        v.orderInfo.objectId1 = objectId1
        return { ...v.orderInfo, ...v.productInfo }
      })
      console.log(newList);
      return { ...state, list: newList || [], listInfo: payload.pageInfo }
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
