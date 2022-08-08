import { message } from "antd";

import { reconSettlementList } from "@/services/finance";
import { parseToThousandth } from '@/utils/date'

const model = {
  namespace: 'generateBill',
  //默认数据
  state: {
    settlementList: [],
  },

  //处理异步事件
  effects: {
     // 结算对账-列表
     *reconSettlementList ({ payload, callback }, { call, put }) {
      let response = yield call(reconSettlementList, payload);
      yield put({ type: 'setQuerySettlementList', payload: response })
      callback && callback(response)
    },
  },

  //处理同步事件
  reducers: {
   // 结算对账-列表
   setQuerySettlementList(state, action) {
    action.payload.data.forEach(item => {
      item.totalSumCount = parseToThousandth(item.totalSumCount);
      item.customerUnconfirmedCount = parseToThousandth(item.customerUnconfirmedCount);
      item.objectionCount = parseToThousandth(item.objectionCount);
      item.customerConfirmedCount = parseToThousandth(item.customerConfirmedCount);
      item.inBillCount = parseToThousandth(item.inBillCount);
    })
    return { ...state, settlementList: action.payload.data || []}
  },
  },

  //发布订阅事件
  subscriptions: {

  },
};
export default model;