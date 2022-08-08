/*
 * @Author: wangzhushan
 * @Date: 2022-05-06 09:39:50
 * @LastEditTime: 2022-05-10 20:35:39
 * @LastEditors: wangzhushan
 * @Description: 投诉管理
 */
import { queryComplainQueryComplain, queryComplainExport, queryComplainPage, queryComplainMouth } from '@/services/qualityManagement'
const Model = {
  namespace: 'complaintManagement',
  state: {

  },
  effects: {
    // 不分页查询投诉来源
    *queryComplainQueryComplain({ payload, callback }, { put, call }) {
      let response = yield call(queryComplainQueryComplain, payload)
      callback && callback(response)
    },
    // 分页查询投诉管理列表
    *queryComplainPage({ payload, callback }, { put, call }) {
      let response = yield call(queryComplainPage, payload)
      callback && callback(response)
    },
    // 投诉管理导出
    *queryComplainExport({ payload, callback }, { put, call }) {
      let response = yield call(queryComplainExport, payload)
      callback && callback(response)
    },
    // 查询当月投诉管理数据
    *queryComplainMouth({ payload, callback }, { put, call }) {
      let response = yield call(queryComplainMouth, payload)
      callback && callback(response)
    },
  },
  reducers: {

  },
};
export default Model;