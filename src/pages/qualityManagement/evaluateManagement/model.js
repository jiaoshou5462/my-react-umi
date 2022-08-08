/*
 * @Author: wangzhushan
 * @Date: 2022-05-06 09:40:06
 * @LastEditTime: 2022-05-10 20:00:01
 * @LastEditors: wangzhushan
 * @Description: 评价管理
 */
import { queryDriverAssessMouth, queryDriverAssessPage, queryDriverAssessExport, queryDriverAssessQueryType } from '@/services/qualityManagement'
const Model = {
  namespace: 'evaluateManagement',
  state: {

  },
  effects: {
    // 查询当月评价数据
    *queryDriverAssessMouth({ payload, callback }, { put, call }) {
      let response = yield call(queryDriverAssessMouth, payload)
      callback && callback(response)
    },
    // 分页查询评价管理列表
    *queryDriverAssessPage({ payload, callback }, { put, call }) {
      let response = yield call(queryDriverAssessPage, payload)
      callback && callback(response)
    },
    // 管理导出
    *queryDriverAssessExport({ payload, callback }, { put, call }) {
      let response = yield call(queryDriverAssessExport, payload)
      callback && callback(response)
    },
    // 不分页查询服务项目
    *queryDriverAssessQueryType({ payload, callback }, { put, call }) {
      let response = yield call(queryDriverAssessQueryType, payload)
      callback && callback(response)
    },
  },
  reducers: {

  },
};
export default Model;