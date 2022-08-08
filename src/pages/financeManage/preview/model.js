/*
 * @Author: wangzhushan
 * @Date: 2022-05-06 16:44:28
 * @LastEditTime: 2022-05-06 19:11:33
 * @LastEditors: wangzhushan
 * @Description: 结算预览
 */
import { yearOverviewStatistics, yearOverviewSelectMonthScope, yearOverviewMonthDetail } from "@/services/finance";

const model = {
    namespace: 'financeManagePreview',
    //默认数据
    state: {

    },
  
    //处理异步事件
    effects: {
      // 统计年度概览基础信息
      *yearOverviewStatistics({ payload, callback }, { call, put }) {
        let response = yield call(yearOverviewStatistics, payload);
        callback && callback(response)
      },
      // 查询近两年月份范围
      *yearOverviewSelectMonthScope({ payload, callback }, { call, put }) {
        let response = yield call(yearOverviewSelectMonthScope, payload);
        callback && callback(response)
      },
      // 查询月度概览详细
      *yearOverviewMonthDetail({ payload, callback }, { call, put }) {
        let response = yield call(yearOverviewMonthDetail, payload);
        callback && callback(response)
      },
    },
  
    //处理同步事件
    reducers: {

    },
  
    //发布订阅事件
    subscriptions: {
  
    },
  };
  export default model;