/*
 * @Author: wangzhushan
 * @Date: 2022-04-26 15:17:19
 * @LastEditTime: 2022-04-28 16:56:24
 * @LastEditors: wangzhushan
 * @Description: 额度管理
 */
import { quotaManageQueryRing } from '@/services/quotaManagement'
const Model = {
  namespace: 'quotamanagement',
  state: {

  },
  effects: {
    // 查询环形图数据
    *QueryRing({ payload, callback }, { put, call }) {
      let response = yield call(quotaManageQueryRing, payload)
      callback && callback(response)
    },
    
  },
  reducers: {

  },
};
export default Model;