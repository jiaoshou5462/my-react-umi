import { getSelectChannelCardAndCardPackage, category, queryGrantBatchPutCount, queryCardByPackageNoNotGroupByCouponNum } from "@/services/cardgrant";
import {  history } from 'umi'
  const model = {
    namespace: 'cardManagement',
    //默认数据
    state: {

    },
  
    //处理异步事件
    effects: {
      // 查询已报价管理查询列表 
      *getSelectChannelCardAndCardPackage({ payload , callback}, { call,put }) {
        let response = yield call(getSelectChannelCardAndCardPackage, payload);
        callback && callback(response)
      },
      // 查询已报价form表单卡券品类数据
      *queryCategory({ payload , callback}, { call,put }) {
        let response = yield call(category, payload);
        callback && callback(response)
      },
      // 查询已报价管理(卡券卡包详情)
      *queryGrantBatchPutCount({ payload , callback}, { call,put }) {
        let response = yield call(queryGrantBatchPutCount, payload);
        callback && callback(response)
      },
      // 查询已报价管理(卡包列表)
      *queryCardByPackageNoNotGroupByCouponNum({ payload , callback}, { call,put }) {
        let response = yield call(queryCardByPackageNoNotGroupByCouponNum, payload);
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