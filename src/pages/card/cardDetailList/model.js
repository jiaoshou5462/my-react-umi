import {
  getQueryList,
  onImportExcelFile,
  onImportExcelCode,
  getCardDetailList,
  deleteCouponDetail,
  queryCouponDetail,
} from '@/services/card'
import {message} from "antd";
const model = {
  namespace: 'cardDetailList',
  //默认数据
  state: {
    cardTypes: [], //卡券形式列表
    cardSources: [], //卡券来源
    categoryList: [], //获取卡券品类(服务)
    pageTotal: 1, //列表总数据
    list: [], //列表
    fileCode: '', //导出文件code
    detailList: '', //详情列表
  },
  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getCardDetailList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setList",
          payload: response.body
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 筛选下拉数据*/
    *getQueryList({payload, callback},{put,call}){
      let response = yield call(getQueryList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setQueryList",
          payload: response.body
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 卡券导出code*/
    *onImportExcelCode({payload, callback},{put,call}){
      let response = yield call(onImportExcelCode, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setImportExcelCode",
          payload: response.body
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 卡券导出File*/
    *onImportExcelFile({payload, callback},{put,call}){
      let response = yield call(onImportExcelFile, payload)
      callback && callback(response)
    },
    /*删除 卡券*/
    *deleteCouponDetail({payload, callback},{put,call}){
      let response = yield call(deleteCouponDetail, payload)
      callback && callback(response)
    },
    /*查看卡券详情*/
    *queryCouponDetail({payload, callback},{put,call}){
      let response = yield call(queryCouponDetail, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setDetailList",
          payload: response.body
        })
      }else {
        message.error(response.result.message)
      }
    },
  },
  //处理同步事件
  reducers: {
    setList(state,{payload}){
      state.list = payload.list || []
      state.pageTotal = payload.total || 1
      return {...state};
    },
    setQueryList(state,{payload}){
      state.cardTypes = payload.cardTypes || []
      state.cardSources = payload.cardSources || []
      state.categoryList = payload.cardCategorys || []
      return {...state};
    },
    setImportExcelCode(state,{payload}){
      state.fileCode = payload
      return {...state};
    },
    setDetailList(state,{payload}){
      state.detailList = payload || []
      return {...state};
    },
    onReset(state) {
      state.fileCode = ''
      return {...state};
    }
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
