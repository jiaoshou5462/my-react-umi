import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';

/*查询所有渠道接口*/
export const getAllChannel = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getBalanceChannelList`,
    ...payload
  })
};

/*未入账汇总对账列表*/
export const getUnBillSummaryList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/balanceUnBill/getUnBillSummaryList`,
    ...payload
  })
};

// 未入账结算明细导出
export const exportUnBillBaseInfoList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/balanceUnBill/exportUnBillBaseInfoList`,
    ...payload
  })
};

/*未入账详情结算明细列表*/
export const getUnBillBaseInfoList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/balanceUnBill/getUnBillBaseInfoList`,
    ...payload
  })
};

// 获取基础卡包卡券明细
// export const getCouponPackageDetail = (payload) => {
//   return createApi({
//     url: `${api}/api/channelBill/cardBalance/getCouponPackageDetail/${payload.cardPackageId}`,
//     ...payload
//   })
// };
/*获取基础卡包卡券明细*/
export const getCouponPackageDetail = (payload) => {
  return createApi({
    url: `${api}/api/coupon/couponPackage/select/pricing/${payload.couponSkuNo}`,
    ...payload
  })
}

// 获取服务类型和项目（1）
export const getServiceProjects = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getCaseStatusAndServiceList`,
    ...payload
  })
};

// 获获取卡券品类-种类（2）
export const getCardCategoryAndTypeList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getCardCategoryAndTypeList`,
    ...payload
  })
};

// 确认入账获取新账单名称
export const generateChannelBillName = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/balanceUnBill/generateChannelBillName`,
    ...payload
  })
};

// 确认入账已有账单查询
export const getAvailableBillList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/balanceUnBill/getAvailableBillList`,
    ...payload
  })
};

// 批量确认入账导入
export const batchConfirmBillImport = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/balanceUnBill/batchConfirmBillImport`,
    ...payload
  })
};

// 批量确认入账导入匹配结果查询
export const getConfirmBillMatchList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/balanceUnBill/getConfirmBillMatchList`,
    ...payload
  })
};

// 确认入账保存
export const getSaveConfirmBill = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/balanceUnBill/saveConfirmBill`,
    ...payload
  })
};

// 渠道对账列表-入账
export const getChannelBalanceBillList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getChannelBalanceBillList`,
    ...payload
  })
};

// 渠道对账列表-查看已入账
export const getChannelBalanceBillInfo = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getChannelBalanceBillInfo/${payload.billId}`,
    ...payload
  })
};

// 入账详情-结算明细
export const getBalanceInfoList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getBalanceInfoList`,
    ...payload
  })
};

// 批量调整金额(上传文件)
export const batchAdjustChannelBalanceAmount = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/batchAdjustChannelBalanceAmount`,
    ...payload
  })
};

// 查询批量导入结果列表
export const getChannelBalanceBillImportResultList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getChannelBalanceBillImportResultList`,
    ...payload
  })
};

// 确认批量调整金额
export const confirmBatchAdjustAmount = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/confirmBatchAdjustAmount`,
    ...payload
  })
};

// 批量撤销入账(上传文件)
export const batchRevokeChannelBalance = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/batchRevokeChannelBalance`,
    ...payload
  })
};

// 确认批量撤销入账
export const confirmBatchRevoke = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/confirmBatchRevoke`,
    ...payload
  })
};

// 已入账-单笔调整金额
export const adjustChannelBalanceAmount = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/adjustChannelBalanceAmount`,
    ...payload
  })
};

// 已入账-单笔撤销入账
export const revokeChannelBalance = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/revokeChannelBalance`,
    ...payload
  })
};

// 导出结算明细
export const exportChanenlBalanceBillDetail = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/exportChanenlBalanceBillDetail`,
    ...payload
  })
};

// 撤销账单-撤销全部入账
export const revokeChannelBalanceBill = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/revokeChannelBalanceBill`,
    ...payload
  })
};

// 处理账单(确认账单/撤销账单/提交初审/提交复审/初审驳回/复审驳回)
export const udpateChannelBalanceBillStatus = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/udpateChannelBalanceBillStatus`,
    ...payload
  })
};


/*
开票申请管理-新增开票申请查询(获取甲方信息)1
*/
export const queryInvoiceConfigInfoByChannelId = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/queryInvoiceConfigInfoByChannelId/${payload.channelId}`,
    ...payload
  })
};
/*
开票申请管理-新增开票申请查询(获取甲方信息)单条
*/
export const queryInvoiceConfigInfoByChannelIdItem = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/queryInvoiceConfigInfoByChannelId/${payload.channelId}/${payload.objectId}`,
    ...payload
  })
};
// 开票申请管理-新增开票申请查询2
export const getChannelBalanceBillAmount = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getChannelBalanceBillAmount/${payload.billId}`,
    ...payload
  })
};
// 开票申请管理-新增开票申请查询(获取发票内容)3
export const getinvoiceContentList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getinvoiceContentList`,
    ...payload
  })
};

// 开票申请管理-新增开票申请（保存）
export const saveChannelBalanceBillInvoiceApply = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/saveChannelBalanceBillInvoiceApply`,
    ...payload
  })
};

// 获取开票信息
export const getinvoiceContent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillInvoice/lastBillInvoiceApply`,
    ...payload
  })
};

/*列表
开票申请管理-开票申请列表查询7
*/
export const getChannelBalanceBillInvoiceApplyList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getChannelBalanceBillInvoiceApplyList`,
    ...payload
  })
};

// 开票申请管理-导出申请
export const exportBalanceBillInvoiceApply = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/exportBalanceBillInvoiceApply`,
    ...payload
  })
};

/*列表
开票申请管理-票据列表查询6
*/
export const getChannelBalanceBillInvoiceApplyDeatilList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getChannelBalanceBillInvoiceApplyDeatilList`,
    ...payload
  })
};

// 开票申请管理-根据发票号码查询(票据详情)
export const getBalanceBillInvoiceInfoWithId = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getBalanceBillInvoiceInfoWithId/${payload.applyId}/${payload.invoiceDetailId}`,
    ...payload
  })
};
// 开票申请管理-根据发票号码查询(票据详情)
export const exportChannelBalanceBillInvoiceApplyDeatilList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/exportChannelBalanceBillInvoiceApplyDeatilList`,
    ...payload
  })
};

// 开票申请管理-开票申请详情列表信息14
export const showChannelBalanceBillInvoiceAppllyDetail = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/showChannelBalanceBillInvoiceAppllyDetail`,
    ...payload
  })
};

// 开票申请管理-查看开票申请详情信息15
export const getChannelBalanceBillInvoiceApplyDetailOne = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/showChannelBalanceBillInvoiceAppllyDetail/${payload.objectId}`,
    ...payload
  })
};
// 开票申请详情-上传发票详情
export const getBalanceBillInvoiceInfo = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getBalanceBillInvoiceInfo/${payload.applyId}`,
    ...payload
  })
};
// 开票申请详情-上传发票保存（红冲发票）
export const saveBalanceBillInvoiceApplyDetail = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/saveBalanceBillInvoiceApplyDetail`,
    ...payload
  })
};
// 开票申请详情-上传发票图片
export const saveBalanceBillInvoiceImage = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/saveBalanceBillInvoiceImage`,
    ...payload
  })
};

// 开票申请详情-查看发票图片
export const getBalanceBillInvoiceImage = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getBalanceBillInvoiceImage/${payload.applyId}`,
    ...payload
  })
};

// 开票申请详情-关联已开票据根据发票号码查询
export const getBalanceBillInvoiceDetailByInvoiceNo = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getBalanceBillInvoiceDetailByInvoiceNo/${payload.invoiceNo}/${payload.channelId}`,
    ...payload
  })
};

// 开票申请详情-关联已开票据根据发票号码查询(列表查询)
export const getBalanceBillInvoiceDetail = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getBalanceBillInvoiceDetail`,
    ...payload
  })
};

// 开票申请详情-上传发票数据文件
export const uploadInvoiceData = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/UploadInvoiceData`,
    ...payload
  })
};

// 开票申请详情-作废发票
export const invalidBalanceBillInvoice = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/invalidBalanceBillInvoice/${payload.objectId}`,
    ...payload
  })
};

// 开票申请详情-关联红冲发票查询
export const getBalanceBillInvoiceInfoWithRed = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillInvoiceApply/getBalanceBillInvoiceInfoWithRed/${payload.applyId}/${payload.invoiceDetailId}`,
    ...payload
  })
};
// 收款管理列表
export const getChannelBalanceBillReciveList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillRecive/getChannelBalanceBillReciveList`,
    ...payload
  })
};

// 收款管理列表-查看收款明细
export const getChannelBalanceBillReciveDetail = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillReciveDetail/getChannelBalanceBillReciveDetail`,
    ...payload
  })
};

// 收款管理列表-新增收款明细
export const saveChannelBalanceBillReciveDetail = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillReciveDetail/saveChannelBalanceBillReciveDetail`,
    ...payload
  })
};

// 收款管理列表-导出应收明细
export const exportChannelBalanceBillRecive = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillRecive/exportChannelBalanceBillRecive`,
    ...payload
  })
};

// 收款管理列表-导出实收明细
export const exportChannelBalanceBillDetailRecive = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillRecive/exportChannelBalanceBillDetailRecive`,
    ...payload
  })
};

// 承保单位
export const getChannelBranchList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/common/getChannelBranchList?channelId=${payload.channelId}`,
    ...payload
  })
};

// 已入账-单笔调整金额-详情列表
export const getChannelBalanceBillAdjustLogList = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBillAdjustLog/getChannelBalanceBillAdjustLogList`,
    ...payload
  })
};


// 查询卡券项目统计
export const getCardBalanceProjectStatistics = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/getCardBalanceProjectStatistics`,
    ...payload
  })
};

// 导出结算明细（项目维度）
export const exportChannelCardProjectBalanceBillDetail = (payload) => {
  return createApi({
    url: `${api}/api/channelBill/channelBalanceBill/exportChannelCardProjectBalanceBillDetail`,
    ...payload
  })
};

// 业务类型列表（包含子类服务类别）
export const getBusinessType = (payload) => {
  return createApi({
    url: `${api}/api/purchase/quotation/businessType/list`,
    ...payload
  })
};

// 结算对账-列表
export const querySettlementList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/settlementManage/settlementList`,
    ...payload
  })
};
// 生成账单-列表
export const reconSettlementList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/settlementManage/settlementList`,
    ...payload
  })
};

// 结算对账-订单列表-汇总金额
export const queryTotalAmount = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/settlementManage/getTotalAmount`,
    ...payload
  })
};

// 结算对账-订单列表
export const querySettlementOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/settlementManage/settlementOrderList`,
    ...payload
  })
};

// 结算对账-导出
export const exportSettlementOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/settlementManage/exportSettlementOrderList`,
    ...payload
  })
};


// 账单处理-账单明细  --Saas和增值
export const billSaasAndVat = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/billSaasAndVat`,
    ...payload
  })
};

// 账单处理-操作记录
export const billLog = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/billLog`,
    ...payload
  })
};

// 账单处理-撤销账单
export const billRevoke = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/billRevoke`,
    ...payload
  })
};

// 账单处理-更改账单状态
export const billUpdateStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/billUpdateStatus`,
    ...payload
  })
};
// 账单处理-账单明细
export const billDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/billDetail`,
    ...payload
  })
}

// 结算对账-查询据实订单详情
export const queryBalanceDetailFact = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceDetail/fact`,
    ...payload
  })
};

// 结算对账-查询营销投放订单详情
export const queryPalanceDetailPut = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceDetail/put`,
    ...payload
  })
};

// 结算对账-查询救援信息详情(轮播图)
export const queryDetailRescueImageList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceDetail/caseDetail`,
    ...payload
  })
}

// 结算对账-案件多段线搜索（详情地图相关）
export const casePolylineSearch = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceDetail/casePolylineSearch`,
    ...payload
  })
}

// 结算对账-加载到达点的index（详情地图相关）
export const loadArrivedPointIndex = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceDetail/loadArrivedPointIndex`,
    ...payload
  })
}

// 结算对账-加载救援时间线（详情地图相关）
export const loadCaseTimeline = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceDetail/loadCaseTimeline`,
    ...payload
  })
}

// 账单处理-列表
export const channelBalanceBillList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/list`,
    ...payload
  })
};

// 账单处理-开票申请
export const billInvoiceApply = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillInvoice/billInvoiceApply`,
    ...payload
  })
};


// 账单处理-开票-获取发票配置信息
export const getInvoiceConfigList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillInvoice/getInvoiceConfigList`,
    ...payload
  })
};

// 账单处理-开票申请-查询开票内容
export const getInvoiceContentList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillInvoice/getInvoiceContentList`,
    ...payload
  })
};
// 账单处理-开票申请-根据账单Id查看已入账账单信息
export const billAmount = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillInvoice/billAmount/${payload.billId}`,
    ...payload
  })
};
// 账单处理-账单信息查询
export const channelBalanceBillInfos = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/info/${payload.billId}`,
    ...payload
  })
};

// 账单处理-账单明细  --场景服务和营销卡券
export const billStatistics = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/billStatistics/${payload.billId}`,
    ...payload
  })
};
// 操作记录
export const queryRecordList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/operateBill/record`,
    ...payload
  })
}
// 分页查询确认入账已有账单
export const queryAvailableBillList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/operateBill/queryAvailableBillList`,
    ...payload
  })
}
// 获取账单名称
export const queryChannelBillName = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/operateBill/getChannelBillName`,
    ...payload
  })
}

// 修改账单明细状态
export const updateOperateStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/operateBill/update`,
    ...payload
  })
}

// 导出账单明细
export const exportBillDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/exportBillDetail`,
    ...payload
  })
};

// 导入订单进行批量确认、撤回操作
export const operateBillImportOrder = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/operateBill/importOrder`,
    ...payload
  })
};

// 分页查询导入的订单
export const operateBillPageBatchImportOrder = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/operateBill/pageBatchImportOrder`,
    ...payload
  })
};

// 确认导入-订单进行确认、撤回操作
export const operateBillConfirmImportOrder = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/operateBill/confirmImportOrder`,
    ...payload
  })
};

// 结算对账-批量入账导入
export const balanceImportCreditImport = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceImport/creditImport`,
    ...payload
  })
}; 

// 结算对账-批量入账确认
export const balanceImportCreditConfirm = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceImport/creditConfirm`,
    ...payload
  })
};

// 结算对账-批量确认操作(勾选框)
export const batchOperateConfirm = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/batchOperate/confirm`,
    ...payload
  })
}; 

// 结算对账-批量确认入账操作(勾选框)
export const batchOperateCredit = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/batchOperate/credit`,
    ...payload
  })
}; 

// 结算对账-批量确认撤回操作(勾选框)
export const batchOperateRevokeConfirm = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/batchOperate/revokeConfirm`,
    ...payload
  })
};

// 结算对账-批量撤销入账导入
export const balanceImportRevokeImport = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceImport/revokeImport`,
    ...payload
  })
};

// 结算对账-批量撤销入账确认
export const balanceImportRevokeConfirm = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/balanceImport/revokeConfirm`,
    ...payload
  })
};

// 账单处理-下载账单明细(PDF)
export const channelBalanceBillExportPDFBillDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/exportPDFBillDetail`,
    ...payload
  })
};

// 结算对账-批量勾选状态校验
export const batchOperateCheckStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/batchOperate/checkStatus`,
    ...payload
  })
};

// 账单处理-批量撤销入账操作
export const batchOperateRevokeCredit = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/batchOperate/revokeCredit`,
    ...payload
  })
};

// 结算对账-批量撤销异议
export const batchOperateRevokeObjection = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/batchOperate/revokeObjection`,
    ...payload
  })
};

// 结算对账-批量异议操作
export const batchOperateObjection = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/batchOperate/objection`,
    ...payload
  })
};

// 账单处理-获取导出字段列表
export const channelBalanceBillSelectZktExportFiled = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/selectZktExportFiled`,
    ...payload
  })
};

// 结算对账-获取导出字段列表
export const settlementManageGetDzExportFields = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/settlementManage/getDzExportFields`,
    ...payload
  })
};

// 结算对账&&账单处理-全选查询操作
export const allBatchOperateQuery = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/allBatchOperate/query`,
    ...payload
  })
};

// 结算对账&&账单处理-全选二次确认操作
export const allBatchOperateConfirm = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/allBatchOperate/confirm`,
    ...payload
  })
};

// 结算对账&&账单处理-全选二次入账
export const allBatchOperateCredit = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/allBatchOperate/credit`,
    ...payload
  })
};

// 账单处理-查询汇总金额
export const allBatchOperateQueryAmout = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/allBatchOperate/queryAmout`,
    ...payload
  })
};

// 账单处理-全选撤销入账校验
export const allBatchOperateRrevokeCheck = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/allBatchOperate/revokeCheck`,
    ...payload
  })
};

// 账单处理-全选撤销入账
export const allBatchOperateRevoke = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/allBatchOperate/revoke`,
    ...payload
  })
};

// 扣减处理-根据账单Id查询信息
export const queryDeductionInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/deduction/info/${payload.billId}`,
    ...payload
  })
};

// 根据扣减id删除扣减账单
export const revocationBillDeduction = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillDeduction/revocationBillDeduction`,
    ...payload
  })
}
export const folderCode = `${api}/api/file/upload?folderCode=sale_customer`;


// 统计年度概览基础信息
export const yearOverviewStatistics = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/yearOverview/year/statistics/info`,
    ...payload
  })
}

// 查询近两年月份范围
export const yearOverviewSelectMonthScope = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/yearOverview/selectMonthScope`,
    ...payload
  })
}

// 查询月度概览详细
export const yearOverviewMonthDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/yearOverview/month/detail`,
    ...payload
  })
}

// 查询子机构列表(数据权限使用)
export const queryChildOrg = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/queryChildOrg`,
    ...payload
  })
}

// 查询承保单位列表(数据权限使用)
export const queryBranchList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/queryBranchList`,
    ...payload
  })
}

// 账单列表标签Tab(待处理|已处理)
export const channelBalanceBillCount = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/count`,
    ...payload
  })
}