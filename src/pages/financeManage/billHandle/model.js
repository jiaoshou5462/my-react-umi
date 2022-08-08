import { message } from "antd";
import { channelBalanceBillList, billInvoiceApply, getInvoiceConfigList, getInvoiceContentList, channelBalanceBillInfos, billStatistics, billSaasAndVat, billLog, billRevoke, billUpdateStatus, billDetail, 
  exportBillDetail,getinvoiceContent,channelBalanceBillExportPDFBillDetail, batchOperateRevokeCredit, channelBalanceBillSelectZktExportFiled, 
  allBatchOperateQueryAmout, allBatchOperateRrevokeCheck, allBatchOperateRevoke, queryDeductionInfo, revocationBillDeduction, queryChildOrg,channelBalanceBillCount} from "@/services/finance";
import { download } from "@/services/cardgrant";
const model = {
  namespace: 'billHandleModel',
  //默认数据
  state: {
    billHandleInfo: {},   //账单明细
    channelBalanceBillInfo: {},
    firstParty: [],
    billContent: [],
    saveQuerySelect: {}, // 账单处理查询参数
    tabNum: null, // 保存tab
  },

  //处理异步事件
  effects: {
    //账单处理-列表
    *channelBalanceBillList ({ payload, callback }, { put, call }) {
      let response = yield call(channelBalanceBillList, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //账单处理-开票申请
    *billInvoiceApply ({ payload, callback }, { put, call }) {
      let response = yield call(billInvoiceApply, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },

    //账单处理-获取发票配置信息
    *getInvoiceConfigList ({ payload, callback }, { put, call }) {
      let response = yield call(getInvoiceConfigList, payload);
      yield put({
        type: 'setInfoByChannelId',
        payload: response.body
      })
      callback && callback(response)
    },
    //账单处理-查询开票内容
    *getInvoiceContentList ({ payload, callback }, { put, call }) {
      let response = yield call(getInvoiceContentList, payload);
      yield put({
        type: 'setInvoiceContentList',
        payload: response.body
      })
      callback && callback(response)
    },
    //账单处理-账单信息查询
    *channelBalanceBillInfos ({ payload, callback }, { put, call }) {
      let response = yield call(channelBalanceBillInfos, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //账单处理-账单明细  --场景服务和营销卡券
    *billStatistics ({ payload, callback }, { put, call }) {
      let response = yield call(billStatistics, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //账单处理-账单明细  --Saas和增值
    *billSaasAndVat ({ payload, callback }, { put, call }) {
      let response = yield call(billSaasAndVat, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },

    //账单处理-操作记录
    *billLog ({ payload, callback }, { put, call }) {
      let response = yield call(billLog, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //账单处理-撤销账单
    *billRevoke ({ payload, callback }, { put, call }) {
      let response = yield call(billRevoke, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    //账单处理-更改账单状态
    *billUpdateStatus ({ payload, callback }, { put, call }) {
      let response = yield call(billUpdateStatus, payload);
      if (response.result.code === '0') {
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },

    //账单处理-账单明细
    *billDetail ({ payload, callback }, { put, call }) {
      let response = yield call(billDetail, payload);
      callback && callback(response)
    },
    // 导出账单明细
    *exportBillDetail ({ payload, callback }, { call, put }) {
      let response = yield call(exportBillDetail, payload);
      callback && callback(response)
    },
    // 获取开票信息
    *getinvoiceContent ({ payload, callback }, { call, put }) {
      let response = yield call(getinvoiceContent, payload);
      callback && callback(response)
    },
    // 账单处理-下载账单明细(PDF)
    *channelBalanceBillExportPDFBillDetail ({ payload, callback }, { call, put }) {
      let response = yield call(channelBalanceBillExportPDFBillDetail, payload);
      callback && callback(response)
    },
    // 账单处理-批量撤销入账操作
    *batchOperateRevokeCredit ({ payload, callback }, { call, put }) {
      let response = yield call(batchOperateRevokeCredit, payload);
      callback && callback(response)
    },
    // 账单处理-获取导出字段列表
    *channelBalanceBillSelectZktExportFiled({ payload, callback }, { call, put }) {
      let response = yield call(channelBalanceBillSelectZktExportFiled, payload);
      callback && callback(response)
    },
    // 账单处理-查询汇总金额
    *allBatchOperateQueryAmout({ payload, callback }, { call, put }) {
      let response = yield call(allBatchOperateQueryAmout, payload);
      callback && callback(response)
    },
    // 账单处理-全选撤销入账校验
    *allBatchOperateRrevokeCheck({ payload, callback }, { call, put }) {
      let response = yield call(allBatchOperateRrevokeCheck, payload);
      callback && callback(response)
    },
    // 账单处理-全选撤销入账
    *allBatchOperateRevoke({ payload, callback }, { call, put }) {
      let response = yield call(allBatchOperateRevoke, payload);
      callback && callback(response)
    },
    // 扣减处理-根据账单Id查询信息
    *queryDeductionInfo({ payload, callback }, { call, put }) {
      let response = yield call(queryDeductionInfo, payload);
      callback && callback(response)
    },
    //文件下载
    *fileDownload({ payload, callback }, { call, put }) {
      let response = yield call(download, payload)
      callback && callback(response)
    },
    // 根据扣减账单id删除扣减账单
    *revocationBillDeduction({ payload, callback }, { call, put }) {
      let response = yield call(revocationBillDeduction, payload)
      callback && callback(response)
    },
    // 查询子机构列表(数据权限使用)
    *queryChildOrg({ payload, callback }, { call, put }) {
      let response = yield call(queryChildOrg, payload)
      callback && callback(response)
    },
     //账单列表标签Tab(待处理|已处理)
     *channelBalanceBillCount ({ payload, callback }, { put, call }) {
      let response = yield call(channelBalanceBillCount, payload)
      callback && callback(response)
    },
  },

  //处理同步事件
  reducers: {
    setBillInfo (state, { payload }) {
      return {
        ...state,
        billHandleInfo: payload
      }
    },

    setInfoByChannelId (state, action) {
      return {
        ...state,
        firstParty: action.payload ? action.payload : []
      }
    },
    setInvoiceContentList (state, action) {
      return {
        ...state,
        billContent: action.payload
      }
    },
    // 保存账单处理查询参数
    saveQuerySelect(state, action) {
      return { ...state, saveQuerySelect: action.payload.queryInfo || {}}
    },  
    // 保存tab数据
    saveTab(state, action) {
      return {...state, tabNum: action.payload.tabNum}
    } 
  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;
