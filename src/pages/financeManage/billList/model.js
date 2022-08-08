import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import {
  getAllChannel,
  getUnBillSummaryList,
  getUnBillBaseInfoList,
  getCouponPackageDetail,
  getServiceProjects,
  getCardCategoryAndTypeList,
  getAvailableBillList,
  generateChannelBillName,
  batchConfirmBillImport,
  getConfirmBillMatchList,
  getSaveConfirmBill,
  exportUnBillBaseInfoList,
  getChannelBalanceBillList,
  getChannelBalanceBillInfo,
  getBalanceInfoList,
  exportChanenlBalanceBillDetail,
  batchAdjustChannelBalanceAmount,
  getChannelBalanceBillImportResultList,
  confirmBatchAdjustAmount,
  batchRevokeChannelBalance,
  confirmBatchRevoke,
  adjustChannelBalanceAmount,
  revokeChannelBalance,
  revokeChannelBalanceBill,
  udpateChannelBalanceBillStatus,
  saveChannelBalanceBillInvoiceApply,//开票
  queryInvoiceConfigInfoByChannelId,
  queryInvoiceConfigInfoByChannelIdItem,
  getChannelBalanceBillAmount,
  getinvoiceContentList,
  getChannelBranchList,
  getChannelBalanceBillAdjustLogList,
  getCardBalanceProjectStatistics,
  exportChannelCardProjectBalanceBillDetail,
  getBusinessType
} from "@/services/finance";
const model = {
  namespace: 'financeManageModel',
  //默认数据
  state: {
    channelList: [],//下拉数据
    unrecordedList: [], //未入账列表
    untotal: 0,//未入账总条数
    total: 0, //数据总条数
    unrecordedDetailList: [],//未入账详情列表
    caseServiceList: [],//服务类型列表
    caseServiceItems: [],//服务项目列表
    caseStatusList: [],//服务状态列表
    cardCategoryList: [],//卡券品类列表
    cardTypeList: [],//卡券种类列表
    isDisable: true,//是否禁用（服务项目列表）
    isFirst: false,//是否禁用（初审提交1）
    isFirstConfirm: false,//是否禁用（初审确认2）
    isFirstReject: false,//是否禁用（初审驳回3）
    isRevoke: false,//是否禁用（撤销账单按钮4）
    existingList: [],//已有账单列表
    billName: '',//新账单名称
    importFileInfor: {
      successCount: 0,//确认入账批量导入匹配成功数据条数
      totalCount: 0,//确认入账批量导入总数
      batchId: '',//导入批次号
    },
    confirmBillMatchList: [],//确认入账批量导入匹配结果查询
    confirmedBillId: null,//入账成功返回的(账单id)
    confirmedAmount: null,//入账成功返回的(账单金额)
    confirmedCount: null,//入账成功返回的(账单笔数)

    recordedList: [],//已入账列表
    channelBalanceBillInfo: [],//	基本信息
    channelBalanceBillInvoiceApplyInfo: [],//开票信息

    infoDetailList: [],//已入账详情列表
    importFileData: {
      adjustCount: 0,//可调整数量
      batchId: '',//导入的批次Id
      passCount: 0,//已匹配数量
      totalCount: 0//确导入的总数量
    },
    importList: [], //查询批量导入结果列表
    firstParty: [],//甲方信息
    firstPartyItem: {},//甲方信息（单条）
    billingAmount: {},//新增开票申请查询
    billContent: [],//发票内容
    billApply: '',//开票申请
    branchList: [],//承保单位
    adjustLogList: [],//单笔调整金额-list
    adjustLogTotal: null,//单笔调整金额-total
    couponPackageDetailList: [],//基础包详情
    businessTypeArr: []//业务类型数组
  },

  //处理异步事件
  effects: {
    // 处理修改值
    *isDisable({ payload }, { put }) {
      console.log(payload)
      yield put({
        type: 'setIsDisable',
        payload,
      });
    },
    *isFirst({ payload }, { put }) {
      console.log(payload)
      yield put({
        type: 'setIsFirst',
        payload,
      });
    },
    *isFirstConfirm({ payload }, { put }) {
      console.log(payload)
      yield put({
        type: 'setIsFirstConfirm',
        payload,
      });
    },
    *isFirstReject({ payload }, { put }) {
      console.log(payload)
      yield put({
        type: 'setIsFirstReject',
        payload,
      });
    },
    *isRevoke({ payload }, { put }) {
      console.log(payload)
      yield put({
        type: 'setIsRevoke',
        payload,
      });
    },

    *isImportList({ payload }, { put }) {
      console.log(payload)
      yield put({
        type: 'setIsImportList',
        payload,
      });
    },
    *isImportFileData({ payload }, { put }) {
      console.log(payload)
      yield put({
        type: 'setIsImportFileData',
        payload,
      });
    },
    // 处理修改值
    *serviceItems({ payload }, { put }) {
      console.log(payload)
      yield put({
        type: 'setServiceItems',
        payload,
      });

    },
    //渠道查询
    *selectChannel({ payload }, { call, put }) {
      let response = yield call(getAllChannel, payload);
      yield put({
        type: "setChannel",
        payload: response.body
      })
    },
    // 未入账汇总对账列表
    *unBillSummaryList({ payload }, { call, put }) {
      let response = yield call(getUnBillSummaryList, payload)

      yield put({
        type: 'setUnbillList',
        payload: response.body
      })
    },
    // 服务类型和项目(1)
    *serviceProjects({ payload }, { call, put }) {
      let response = yield call(getServiceProjects, payload);
      // console.log(response, 'pro')
      yield put({
        type: 'setServePro',
        payload: response.body
      })
    },
    // 获取卡券品类-种类(2)
    *cardCategoryAndTypeList({ payload }, { call, put }) {
      let response = yield call(getCardCategoryAndTypeList, payload);
      // console.log(response,'card')
      yield put({
        type: 'setCardCategoryAnd',
        payload: response.body
      })
    },
    // 未入账详情结算明细列表
    *unBillBaseInfoList({ payload }, { call, put }) {
      let response = yield call(getUnBillBaseInfoList, payload)
      // console.log(response, 'detaillist')
      yield put({
        type: 'setUnbillDetailList',
        payload: response.body
      })
    },
    // 获取基础卡包卡券明细
    *couponPackageDetail({ payload }, { call, put }) {
      let response = yield call(getCouponPackageDetail, payload)
      yield put({
        type: 'setCouponPackageDetail',
        payload: response.body
      })
    },

    // 导出未入账明细
    *exportUnInfoList({ payload, callback }, { call, put }) {
      let response = yield call(exportUnBillBaseInfoList, payload);
      yield put({
        type: 'setUnInfoList',
        payload: response.body
      })
      callback && callback(response)
    },
    // 已有账单查询
    *availableBillList({ payload }, { call, put }) {
      let response = yield call(getAvailableBillList, payload)
      // console.log(response, '已有账单查询')
      yield put({
        type: 'setAvailableBillList',
        payload: response.body
      })
    },
    //账单名称
    *channelBillName({ payload, callback }, { call, put }) {
      let response = yield call(generateChannelBillName, payload)
      // console.log(response, 'aaa')
      yield put({
        type: 'setChannelBillName',
        payload: response.body
      })
      callback && callback(response)
    },
    *confirmBillImport({ payload, callback }, { call, put }) {
      let response = yield call(batchConfirmBillImport, payload)
      // console.log(response, '已有账单查询')
      yield put({
        type: 'getConfirmBillImport',
        payload: response.body
      })
      callback && callback(response)
    },
    *confirmBillMatchList({ payload }, { call, put }) {
      let response = yield call(getConfirmBillMatchList, payload)
      // console.log(response, 'aaa')
      yield put({
        type: 'setConfirmBillMatchList',
        payload: response.body
      })
    },
    // 确认入账保存
    *saveConfirmBill({ payload, callback }, { call, put }) {
      let response = yield call(getSaveConfirmBill, payload);
      yield put({
        type: 'setSaveConfirmBill',
        payload: response.body
      })
      callback && callback(response)

    },
    // 渠道对账列表-入账（已入账列表）
    *billList({ payload }, { call, put }) {
      let response = yield call(getChannelBalanceBillList, payload)
      // console.log(response,'入账')
      yield put({
        type: 'setBillList',
        payload: response.body
      })
    },
    // 查看已入账
    *billInfo({ payload }, { call, put }) {
      let response = yield call(getChannelBalanceBillInfo, payload)
      yield put({
        type: 'setBillInfo',
        payload: response.body
      })
    },
    // 入账详情-结算明细
    *infoList({ payload }, { call, put }) {
      let response = yield call(getBalanceInfoList, payload)
      yield put({
        type: 'setInfoList',
        payload: response.body
      })
    },
    // 批量调整金额(导入文件)
    *batchAdjust({ payload, callback }, { call, put }) {
      let response = yield call(batchAdjustChannelBalanceAmount, payload)
      yield put({
        type: 'setbatchAdjust',
        payload: response.body
      })
      callback && callback(response)
    },
    // 查询批量导入结果列表
    *importResultList({ payload, callback }, { call, put }) {
      let response = yield call(getChannelBalanceBillImportResultList, payload)
      yield put({
        type: 'setImportResultList',
        payload: response.body
      })
      callback && callback(response)
    },
    // 确认批量调整金额
    *confirmAdjustAmount({ payload, callback }, { call, put }) {
      let response = yield call(confirmBatchAdjustAmount, payload)
      // console.log(response,'response')
      yield put({
        type: 'setConfirmAdjustAmount',
        payload: response.body
      })
      callback && callback(response);
    },
    // 批量撤销入账(文件上传)
    *batchRevokeFile({ payload, callback }, { call, put }) {
      let response = yield call(batchRevokeChannelBalance, payload)
      yield put({
        type: 'setBatchRevoke',
        payload: response.body
      })
      callback && callback(response)
    },
    // 确认批量撤销入账
    *confirmRevoke({ payload, callback }, { call, put }) {
      let response = yield call(confirmBatchRevoke, payload)
      yield put({
        type: 'setConfirmRevoke',
        payload: response.body
      })
      callback && callback(response)

    },
    // 单笔调整金额
    *singleAdjustAmount({ payload, callback }, { call, put }) {
      let response = yield call(adjustChannelBalanceAmount, payload)
      yield put({
        type: 'setSingleAdjustAmount',
        payload: response.body
      })
      callback && callback(response)

    },

    // 单笔撤销入账
    *singleRevokeBalance({ payload, callback }, { call, put }) {
      let response = yield call(revokeChannelBalance, payload)
      yield put({
        type: 'setSingleRevokeBalance',
        payload: response.body
      })
      callback && callback(response)

    },

    // 导出结算明细
    *billDetail({ payload, callback }, { call, put }) {
      let response = yield call(exportChanenlBalanceBillDetail, payload)
      yield put({
        type: 'setBillDetail',
        payload: response.body
      })
      callback && callback(response)
    },

    // 撤销账单-撤销全部入账
    *revokeBill({ payload, callback }, { call, put }) {
      let response = yield call(revokeChannelBalanceBill, payload)

      yield put({
        type: 'setRevokeBill',
        payload: response.body
      })
      callback && callback(response)
    },
    // 账单处理
    *udpateBill({ payload, callback }, { call, put }) {
      let response = yield call(udpateChannelBalanceBillStatus, payload)

      yield put({
        type: 'setUdpateBill',
        payload: response.body
      })
      callback && callback(response)
    },

    // 新增开票申请查询(获取甲方信息)1
    *infoByChannelId({ payload, callback }, { call, put }) {
      let response = yield call(queryInvoiceConfigInfoByChannelId, payload);
      yield put({
        type: 'setInfoByChannelId',
        payload: response.body
      })
      callback && callback(response)
    },
    // 新增开票申请查询(获取甲方信息)单条
    *infoByChannelIdItem({ payload, callback }, { call, put }) {
      let response = yield call(queryInvoiceConfigInfoByChannelIdItem, payload);
      yield put({
        type: 'setInfoByChannelIdItem',
        payload: response.body
      })
      callback && callback(response)
    },
    // 开票申请管理-新增开票申请查询2
    *billAmount({ payload }, { call, put }) {
      let response = yield call(getChannelBalanceBillAmount, payload);
      yield put({
        type: 'setBillAmount',
        payload: response.body
      })
    },
    // 新增开票申请查询(获取发票内容)3
    *invoiceContentList({ payload }, { call, put }) {
      let response = yield call(getinvoiceContentList, payload);
      yield put({
        type: 'setIceContentList',
        payload: response.body
      })
    },
    //新增开票申请(保存)
    *invoiceApply({ payload, callback }, { call, put }) {
      let response = yield call(saveChannelBalanceBillInvoiceApply, payload);
      yield put({
        type: 'setInvoiceApply',
        payload: response.body
      })
      callback && callback(response)
    },
    // 承保单位
    *channelBranchList({ payload, callback }, { call, put }) {
      let response = yield call(getChannelBranchList, payload);
      yield put({
        type: 'setChannelBranchList',
        payload: response.body
      })
      callback && callback(response)
    },

    *billAdjustLogList({ payload, callback }, { call, put }) {
      let response = yield call(getChannelBalanceBillAdjustLogList, payload);
      yield put({
        type: 'setBillAdjustLogList',
        payload: response.body
      })
      // callback && callback(response)
    },

    // 查询卡券项目统计
    *cardBalanceProjectStatistics({ payload, callback }, { call, put }) {
      let response = yield call(getCardBalanceProjectStatistics, payload)
      yield put({
        type: 'setCardBalanceProjectStatistics',
        payload: response.body
      })
      callback && callback(response)
    },
    // 导出结算明细（项目维度）
    *exportCardProjectDetail({ payload, callback }, { call, put }) {
      let response = yield call(exportChannelCardProjectBalanceBillDetail, payload)
      yield put({
        type: 'setExportCardProjectDetail',
        payload: response.body
      })
      callback && callback(response)
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
  },





  //处理同步事件
  reducers: {
    // 修改数据
    setIsDisable(state, action) {
      return { ...state, isDisable: action.payload };
    },
    setIsFirst(state, action) {
      return { ...state, isFirst: action.payload };
    },
    setIsFirstConfirm(state, action) {
      return { ...state, isFirstConfirm: action.payload };
    },
    setIsFirstReject(state, action) {
      return { ...state, isFirstReject: action.payload };
    },
    setIsRevoke(state, action) {
      return { ...state, isRevoke: action.payload };
    },

    setServiceItems(state, action) {
      return { ...state, caseServiceItems: action.payload };
    },
    setIsImportList(state, action) {
      return { ...state, importList: action.payload };
    },
    setIsImportFileData(state, action) {
      return { ...state, importFileData: action.payload };
    },
    //1设置渠道数据
    setChannel(state, action) {
      // console.log(action, 'action123')
      //在这做数据处理
      return { ...state, channelList: action.payload.channelList };
    },
    //2设置未入账列表
    setUnbillList(state, action) {
      //在这做数据处理
      return {
        ...state,
        unrecordedList: action.payload.list,
        untotal: action.payload.total
      }//state里面的数据：action.payload
    },
    //4设置详情
    setUnbillDetailList(state, action) {
      return { ...state, unrecordedDetailList: action.payload.list, total: action.payload.total }
    },
    setCouponPackageDetail(state, action) {
      console.log(action, '基础卡包卡券明细')
      return {
        ...state,
        couponPackageDetailList: action.payload,
      };
    },
    //服务项目
    setServePro(state, action) {
      // console.log(action, 'actionpro')
      return {
        ...state,
        caseServiceList: action.payload.caseServiceList,//服务类型和项目
        caseStatusList: action.payload.caseStatusList,//案件状态
      }
    },
    // 获取卡券品类-种类
    setCardCategoryAnd(state, action) {
      return {
        ...state,
        cardCategoryList: action.payload.cardCategoryList,//品类列表
        cardTypeList: action.payload.cardTypeList,//种类列表
      }
    },
    // 确认入账已有账单查询
    setAvailableBillList(state, action) {
      // console.log(action, '已有账单查询')
      return { ...state, existingList: action.payload.list }
    },
    // 新账单名称
    setChannelBillName(state, action) {
      // console.log(action, '新账单名称')
      return { ...state, billName: action.payload.billName }
    },
    // 批量确认入账导入匹配数据
    getConfirmBillImport(state, action) {
      // console.log(action, '导入总数据和匹配成功')
      return { ...state, importFileInfor: action.payload }
    },
    // 批量确认入账导入匹配结果查询
    setConfirmBillMatchList(state, action) {
      // console.log(action, '导入匹配结果')
      return { ...state, confirmBillMatchList: action.payload.list }
    },
    //确认入账保存
    setSaveConfirmBill(state, action) {
      // console.log(action, '确认入账保存')
      return {
        ...state,
        confirmedBillId: action.payload.billId,
        confirmedAmount: action.payload.confirmedAmount,
        confirmedCount: action.payload.confirmedCount
      }
    },
    // 导出未入账明细
    setUnInfoList(state, action) {
      // console.log(action, '未入账明细')
      return { ...state }
    },
    // 设置渠道对账列表-入账（已入账）
    setBillList(state, action) {
      // console.log(state, action, 'hhda')
      return { ...state, recordedList: action.payload.list, total: action.payload.total }
    },
    // 查看已入账
    setBillInfo(state, action) {
      return {
        ...state,
        channelBalanceBillInfo: action.payload.channelBalanceBillInfo,//基本信息
        channelBalanceBillInvoiceApplyInfo: action.payload.channelBalanceBillInvoiceApplyInfo,//开票信息

      }
    },
    // 入账详情-结算明细列表
    setInfoList(state, action) {
      return {
        ...state,
        infoDetailList: action.payload.list,
        total: action.payload.total
      }
    },
    // 批量调整金额
    setbatchAdjust(state, action) {
      // console.log(action, 'money')
      return {
        ...state,
        importFileData: action.payload
      }
    },
    // 查询批量导入结果列表
    setImportResultList(state, action) {
      return {
        ...state,
        importList: action.payload.list,
        total: action.payload.total
      }
    },
    // 确认批量调整金额
    setConfirmAdjustAmount(state, action) {
      // console.log(action, '333')
      return {
        ...state
      }
    },

    // 批量撤销入账(文件上传)
    setBatchRevoke(state, action) {
      return {
        ...state,
        importFileData: action.payload
      }
    },
    // 确认批量撤销入账                                                                   
    setConfirmRevoke(state, action) {
      return {
        ...state,
        // infoDetailList: action.payload.list,
        // total: action.payload.total
      }
    },
    // 单笔调整金额
    setSingleAdjustAmount(state, action) {
      return {
        ...state,
        // infoDetailList: action.payload.list,
        // total: action.payload.total
      }
    },
    // 单笔撤销入账
    setSingleRevokeBalance(state, action) {
      return {
        ...state,
        // infoDetailList: action.payload.list,
        // total: action.payload.total
      }
    },
    // 导出结算明细
    setBillDetail(state, action) {
      return {
        ...state
      }
    },
    // 撤销账单-撤销全部入账
    setRevokeBill(state, action) {
      return {
        ...state
      }
    },
    // 处理账单
    setUdpateBill(state, action) {
      return {
        ...state
      }
    },
    // 新增开票申请查询(获取甲方信息)1
    setInfoByChannelId(state, action) {
      // console.log(action, '===')
      return {
        ...state,
        firstParty: action.payload
      }
    },
    // 新增开票申请查询(获取甲方信息)单条
    setInfoByChannelIdItem(state, action) {
      return {
        ...state,
        firstPartyItem: action.payload
      }
    },
    // 开票申请管理-新增开票申请查询2
    setBillAmount(state, action) {
      // console.log(action.payload,'action.payload')
      return {
        ...state,
        billingAmount: action.payload
      }
    },
    // 新增开票申请查询(获取发票内容)3
    setIceContentList(state, action) {
      return {
        ...state,
        billContent: action.payload
      }
    },
    // 新增开票申请
    setInvoiceApply(state, action) {
      // console.log(action, 'action111')
      return {
        ...state,
        billApply: action.payload
      }
    },
    // 承保单位
    setChannelBranchList(state, action) {
      // console.log(action, '12')
      return {
        ...state,
        branchList: action.payload
      }
    },
    setBillAdjustLogList(state, action) {
      // console.log(action, 'action12')
      return {
        ...state,
        adjustLogList: action.payload.list,
        adjustLogTotal: action.payload.total
      }
    },
    // 查询卡券项目统计
    setCardBalanceProjectStatistics(state, action) {
      // console.log(action.payload, '查询卡券项目统计')
      return {
        ...state,
        proStatisticsList: action.payload.list
      }
    },
    // 导出结算明细（项目维度）
    setExportCardProjectDetail(state, action) {
      console.log(action, '项目维度')
      return {
        ...state,
        // proStatisticsList: action.payload.list
      }
    },
    setBusinessType(state, action) {
      // console.log(action, '业务类型')
      return {
        ...state,
        businessTypeArr: action.payload
      }
    }
  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;