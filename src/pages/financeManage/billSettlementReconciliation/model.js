import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import { querySettlementList, queryTotalAmount, querySettlementOrderList, exportSettlementOrderList, queryBalanceDetailFact, queryPalanceDetailPut, queryDetailRescueImageList, queryRecordList,
  queryAvailableBillList, queryChannelBillName, updateOperateStatus, operateBillImportOrder, operateBillPageBatchImportOrder, operateBillConfirmImportOrder, balanceImportCreditImport,
  balanceImportCreditConfirm, batchOperateRevokeConfirm, batchOperateCredit, batchOperateConfirm, balanceImportRevokeImport, balanceImportRevokeConfirm, batchOperateCheckStatus, 
  batchOperateRevokeObjection, batchOperateObjection, settlementManageGetDzExportFields, allBatchOperateQuery, allBatchOperateConfirm, allBatchOperateCredit,
  queryChildOrg, queryBranchList} from "@/services/finance";
import { parseToThousandth } from '@/utils/date'

const model = {
  namespace: 'billSettlementReconciliationModel',
  //默认数据
  state: {
    settlementList: [],
    balanceDetailFact: {}, //场景服务数据
    palanceDetailPut: {}, // 营销服务数据
    detailRescueInfo: {}, // 轮播图数据
    querySelect: {}, // 结算对账列表参数
    saveQuerySelect: {}, // 结算对账分类列表参数
  },

  //处理异步事件
  effects: {
    // 结算对账-列表
    *querySettlementList ({ payload, callback }, { call, put }) {
      let response = yield call(querySettlementList, payload);
      yield put({ type: 'setQuerySettlementList', payload: response })
      callback && callback(response)
    },
    // 结算对账-订单列表-汇总金额
    *queryTotalAmount ({ payload, callback }, { call, put }) {
      let response = yield call(queryTotalAmount, payload);
      callback && callback(response)
    },
    // 结算对账-订单列表
    *querySettlementOrderList ({ payload, callback }, { call, put }) {
      let response = yield call(querySettlementOrderList, payload);
      callback && callback(response)
    },
    // 结算对账-导出
    *exportSettlementOrderList ({ payload, callback }, { call, put }) {
      let response = yield call(exportSettlementOrderList, payload);
      callback && callback(response)
    },
    // 结算对账-查询据实订单详情
    *queryBalanceDetailFact ({ payload, callback }, { call, put }) {
      let response = yield call(queryBalanceDetailFact, payload);
      if (response.result.code == 0) {
        yield put({ type: 'setQueryBalanceDetailFact', payload: response })
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    // 结算对账-查询营销投放订单详情
    *queryPalanceDetailPut ({ payload, callback }, { call, put }) {
      let response = yield call(queryPalanceDetailPut, payload);
      if (response.result.code == 0) {
        yield put({ type: 'setQueryPalanceDetailPut', payload: response })
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    // 结算对账-查询救援信息详情(轮播图)
    *queryDetailRescueImageList ({ payload, callback }, { call, put }) {
      let response = yield call(queryDetailRescueImageList, payload);
      if (response.result.code == 0) {
        yield put({ type: 'setDetailRescueImageList', payload: response })
        callback && callback(response)
      } else {
        message.error(response.result.message)
      }
    },
    // -不分页查询账单操作记录(操作记录) 
    *queryRecordList ({ payload, callback }, { call, put }) {
      let response = yield call(queryRecordList, payload);
      callback && callback(response)
    },
    // -分页查询确认入账已有账单
    *queryAvailableBillList ({ payload, callback }, { call, put }) {
      let response = yield call(queryAvailableBillList, payload);
      callback && callback(response)
    },
    // -获取账单名称
    *queryChannelBillName ({ payload, callback }, { call, put }) {
      let response = yield call(queryChannelBillName, payload);
      callback && callback(response)
    },
    // -修改账单明细状态
    *updateOperateStatus ({ payload, callback }, { call, put }) {
      let response = yield call(updateOperateStatus, payload);
      callback && callback(response)
    },
    // 导入订单进行批量确认、撤回操作
    *operateBillImportOrder ({ payload, callback }, { call, put }) {
      let response = yield call(operateBillImportOrder, payload);
      callback && callback(response)
    },
    // 分页查询导入的订单
    *operateBillPageBatchImportOrder ({ payload, callback }, { call, put }) {
      let response = yield call(operateBillPageBatchImportOrder, payload);
      callback && callback(response)
    },
    // 确认导入-订单进行确认、撤回操作
    *operateBillConfirmImportOrder ({ payload, callback }, { call, put }) {
      let response = yield call(operateBillConfirmImportOrder, payload);
      callback && callback(response)
    },
    // 结算对账-批量入账导入
    *balanceImportCreditImport ({ payload, callback }, { call, put }) {
      let response = yield call(balanceImportCreditImport, payload);
      callback && callback(response)
    },
    // 结算对账-批量入账确认
    *balanceImportCreditConfirm ({ payload, callback }, { call, put }) {
      let response = yield call(balanceImportCreditConfirm, payload);
      callback && callback(response)
    },
    // 结算对账-批量确认操作(勾选框)
    *batchOperateConfirm({ payload, callback }, { call, put }) {
      let response = yield call(batchOperateConfirm, payload);
      callback && callback(response)
    },
    // 结算对账-批量确认入账操作(勾选框)
    *batchOperateCredit({ payload, callback }, { call, put }) {
      let response = yield call(batchOperateCredit, payload);
      callback && callback(response)
    },
    // 结算对账-批量确认撤回操作(勾选框)
    *batchOperateRevokeConfirm({ payload, callback }, { call, put }) {
      let response = yield call(batchOperateRevokeConfirm, payload);
      callback && callback(response)
    },
    // 结算对账-批量撤销入账导入
    *balanceImportRevokeImport({ payload, callback }, { call, put }) {
      let response = yield call(balanceImportRevokeImport, payload);
      callback && callback(response)
    },
    // 结算对账-批量撤销入账确认
    *balanceImportRevokeConfirm({ payload, callback }, { call, put }) {
      let response = yield call(balanceImportRevokeConfirm, payload);
      callback && callback(response)
    },
    // 结算对账-批量勾选状态校验
    *batchOperateCheckStatus({ payload, callback }, { call, put }) {
      let response = yield call(batchOperateCheckStatus, payload);
      callback && callback(response)
    },
    // 结算对账-批量撤销异议
    *batchOperateRevokeObjection({ payload, callback }, { call, put }) {
      let response = yield call(batchOperateRevokeObjection, payload);
      callback && callback(response)
    },
    // 结算对账-批量异议操作
    *batchOperateObjection({ payload, callback }, { call, put }) {
      let response = yield call(batchOperateObjection, payload);
      callback && callback(response)
    },
    // 结算对账-获取导出字段列表
    *settlementManageGetDzExportFields({ payload, callback }, { call, put }) {
      let response = yield call(settlementManageGetDzExportFields, payload);
      callback && callback(response)
    },
    // 结算对账&&账单处理-全选查询操作
    *allBatchOperateQuery({ payload, callback }, { call, put }) {
      let response = yield call(allBatchOperateQuery, payload);
      callback && callback(response)
    },
    // 结算对账&&账单处理-全选二次确认操作
    *allBatchOperateConfirm({ payload, callback }, { call, put }) {
      let response = yield call(allBatchOperateConfirm, payload);
      callback && callback(response)
    },
    // 结算对账&&账单处理-全选二次入账操作
    *allBatchOperateCredit({ payload, callback }, { call, put }) {
      let response = yield call(allBatchOperateCredit, payload);
      callback && callback(response)
    },
    // 查询所属机构
    *queryOrgId ({ payload, callback }, { call, put }) {
      let response = yield call(queryChildOrg, payload);
      callback && callback(response)
    },
    // 查询承保单位列表(数据权限使用
    *queryBranchList ({ payload, callback }, { call, put }) {
      let response = yield call(queryBranchList, payload);
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
    // 结算对账-查询据实订单详情
    setQueryBalanceDetailFact (state, action) {
      return { ...state, balanceDetailFact: action.payload.body || {} }
    },
    // 结算对账-查询营销投放订单详情
    setQueryPalanceDetailPut (state, action) {
      return { ...state, palanceDetailPut: action.payload.body || {} }
    },
    // 结算对账-查询救援信息详情(轮播图)
    setDetailRescueImageList (state, action) {
      return { ...state, detailRescueInfo: action.payload.body || {} }
    },
    // 保存结算对账的查询参数
    querySelect(state, action) {
      return { ...state, querySelect: action.payload.queryInfo || {} }
    },
    // 保存结算对账分类订单列表查询参数
    saveQuerySelect(state, action) {
      return { ...state, saveQuerySelect: action.payload.queryInfo || {}}
    }
  },

  //发布订阅事件
  subscriptions: {

  },
};
export default model;