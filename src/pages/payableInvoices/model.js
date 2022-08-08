import { message } from "antd";
import { connect, history } from 'umi'

import {
  getPayableAndInvoiceList,
  getInvoiceDetails,
  getPaymentDetails,
  getBusinessType,
  getExpressDetail,
} from "@/services/payableInvoices";

const model = {
  namespace: 'payableInvoicesModel',
  //默认数据
  state: {
    payableInvoiceList: [],//应付及发票列表
    payableInvoiceTotal: null,//应付及发票列表总数
    billInfo: {},

    invoiceApplyInfo:null,
    invoiceDetailsList: [],
    invoiceInfo: null,

    payableInfo: {},
    paymentDetailsList: [],
    businessTypeArr: [],//业务类型数组
    saveQuerySelect: {}, // 应付及发票列表参数
  },

  //处理异步事件
  effects: {
    // 处理修改值

    // 应付及发票列表
    *payableAndInvoiceList({ payload, callback }, { call, put }) {
      let response = yield call(getPayableAndInvoiceList, payload)
      yield put({
        type: 'setPayableAndInvoiceList',
        payload: response
      })
      callback && callback(response)
    },
    // 查询发票详情
    *invoiceDetails({ payload }, { call, put }) {
      let response = yield call(getInvoiceDetails, payload)
      yield put({
        type: 'setInvoiceDetails',
        payload: response.body
      })
    },
    // 查询付款详情
    *paymentDetails({ payload }, { call, put }) {
      let response = yield call(getPaymentDetails, payload)
      yield put({
        type: 'setPaymentDetails',
        payload: response.body
      })
    },
    // 业务类型
    *businessType({ payload, callback }, { call, put }) {
      let response = yield call(getBusinessType, payload);
      yield put({
        type: 'setBusinessType',
        payload: response.body
      })
      // callback && callback(response)
    },
    /*获取快递详情*/
    *getExpressDetail({payload, callback},{put,call}){
      let response = yield call(getExpressDetail, payload)
        callback && callback(response)
    },

  },

  //处理同步事件
  reducers: {
    // 修改数据
    // setIsDisable(state, action) {
    //   return { ...state, isDisable: action.payload };
    // },
    setPayableAndInvoiceList(state, action) {
      if(action.payload.result.code==0) {
        return {
          ...state,
          payableInvoiceList: action.payload.body.list,
          payableInvoiceTotal: action.payload.body.total
        };
      }else {
        message.error(action.payload.result.message)
      }
    },
    setInvoiceDetails(state, action) {
      // console.log(action, '发票详情')
      return {
        ...state,
        billInfo: action.payload&&action.payload.billInfo?action.payload.billInfo:{},
        invoiceApplyInfo: action.payload&&action.payload.invoiceApplyInfo?action.payload.invoiceApplyInfo:null,
        invoiceDetailsList: action.payload&&action.payload.invoiceDetailsList?action.payload.invoiceDetailsList:null,
        invoiceInfo: action.payload&&action.payload.invoiceInfo?action.payload.invoiceInfo:null
      };
    },
    setPaymentDetails(state, action) {
      // console.log(action, '付款详情')
      return {
        ...state,
        billInfo: action.payload.billInfo,
        payableInfo: action.payload.payableInfo,
        paymentDetailsList: action.payload.paymentDetailsList
      };
    },
    setBusinessType(state, action) {
      // console.log(action, '业务类型')
      return {
        ...state,
        businessTypeArr: action.payload
      }
    },
    // 保存应付及发票列表参数列表查询参数
    saveQuerySelect(state, action) {
      return { ...state, saveQuerySelect: action.payload.queryInfo || {}}
    }
  },

  //发布订阅事件
  subscriptions: {

  },
};
export default model;