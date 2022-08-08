/*销售管理*/
import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';

/*获取销售管理列表*/
export const getSaleOrderList = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/list`,
    ...payload
  })
}
/*销售管理订单 废弃接口*/
export const onSaleOrderInvalid = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/orderAbandon`,
    ...payload
  })
}
/*新增销售管理 基础信息*/
export const addSaleOrder = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/add`,
    ...payload
  })
}
/*获取销售管理 基础信息 详请*/
export const getSaleOrderDetail = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/info`,
    ...payload
  })
}
/*活动列表 - 获取渠道*/
export const getActivityChannelList = (payload) => {
  return createApi({
    url: `${api}/api/marketing/LonginCustomer/customerChannelList`,
    ...payload
  })
}
/*编辑销售管理 基础信息*/
export const editSaleOrder = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/update`,
    ...payload
  })
}
/*新增SaAs订单Item信息*/
export const addItemSAAS = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/addItemSaas`,
    ...payload
  })
}
/*获取SAAS订单Item 详请*/
export const getItemSAASDetail = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/selectItemSaas`,
    ...payload
  })
}
/*新增增值订单Item信息*/
export const addItemVat = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/addItemVat`,
    ...payload
  })
}
/*查询增值订单Item信息*/
export const getItemVatDetail = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/selectItemVat`,
    ...payload
  })
}
/*删除增值订单Item信息*/
export const delItemVat = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/delItemVat`,
    ...payload
  })
}
/*提交订单*/
export const onSubmitInfo = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/submitInfo`,
    ...payload
  })
}
/*计算订单时间(不足一个月按一个月计算)*/
export const onCalculateTime = (payload) =>{
  return createApi({url:`${api}/api/purchase/saleOrder/calculateOrderTime`,
    ...payload
  })
}

/**
  采购报价单接口
* */
/*获取采购报价单列表*/
export const getPurchaseQuotationList = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/selectInfoPage`,
    ...payload
  })
}
/*新增采购报价单*/
export const addPurchaseQuotation = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/addInfo`,
    ...payload
  })
}
/*获取采购报价单详请*/
export const getPurchaseQuotationDetail = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/findInfoByNo`,
    ...payload
  })
}
/*获取采购报价单适用范围详请*/
export const getSelectFactRegion = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/selectFactRegion`,
    ...payload
  })
}
/*编辑采购报价单*/
export const editPurchaseQuotation = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/updateInfo`,
    ...payload
  })
}
/*删除采购报价单*/
export const onDelPurchaseQuotation = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/delInfo`,
    ...payload
  })
}
/*选择sku列表*/
export const getSelectSkuList = (payload) => {
  return createApi({url:`${api}/api/provider/product/selectProductInfoByProviderNoPage`,
    ...payload
  })
}
/*选择sku校验接口*/
export const onCheckSelectSku = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/valid/optional`,
    ...payload
  })
}
/*新增采购报价单明细*/
export const addPurchaseItemFact = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/addItemFact`,
    ...payload
  })
}
/*更新采购报价单明细*/
export const editPurchaseItemFact = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/updateItemFact`,
    ...payload
  })
}
/*采购报价的服务报价清单*/
export const getPurchaseItemFactList = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/selectItemFact`,
    ...payload
  })
}
/*获取采购报价的服务报价清单 明细详请*/
export const getPurchaseItemDetail= (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/findItemFact`,
    ...payload
  })
}
/*删除采购报价明细*/
export const onDelPurchaseItemFact = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/delItemFact`,
    ...payload
  })
}
/*提交采购报价单*/
export const onSubmitPurchase = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/submitInfo`,
    ...payload
  })
}

/**
*  采购订单 接口
* */
/*采购订单 列表接口*/
export const getPurPricingList = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseOrder/selectPage`,
    ...payload
  })
}
/*采购订单 作废*/
export const onPurchaseVoid = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseOrder/obsolete`,
    ...payload
  })
}
/*采购订单 选择报价列表接口*/
export const getPurQuotationList = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/valid/self/list`,
    ...payload
  })
}
/*采购订单 报价明细列表接口*/
export const getPurValidItemList = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseQuotation/selectValidItemFact`,
    ...payload
  })
}
/*新增采购订单*/
export const addPurchaseOrder = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseOrder/add`,
    ...payload
  })
}
/*采购订单详请*/
export const getPurchaseOrderDetail = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseOrder/select`,
    ...payload
  })
}
/*采购订单详请 报价明细接口*/
export const getPurDetailList = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseOrder/selectProduct`,
    ...payload
  })
}
/*编辑采购订单*/
export const editPurchaseOrder = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseOrder/update`,
    ...payload
  })
}
/*提交采购订单*/
export const onSubmitPurchaseOrder = (payload) => {
  return createApi({url:`${api}/api/purchase/purchaseOrder/submit`,
    ...payload
  })
}
/**
* 采购库存管理
**/
/*采购库存管理 按批次*/
export const getPurStockBatchList = (payload) => {
  return createApi({url:`${api}/api/purchase/inboundStock/batch/selectPage`,
    ...payload
  })
}
/*采购库存管理 按服务*/
export const getPurStockProductList = (payload) => {
  return createApi({url:`${api}/api/purchase/inboundStock/product/selectPage`,
    ...payload
  })
}

/**
* 导入销售客户
* */
/*上传销售客户文件*/
export const addFileTaskInfo = (payload) => {
  return createApi({url:`${api}/api/channel-service/fileTask/fileTaskInfo`,
    ...payload
  })
}
/*获取销售客户文件 列表*/
export const getFileTaskList = (payload) => {
  return createApi({url:`${api}/api/channel-service/fileTask/fileTaskList`,
    ...payload
  })
}
/*获取销售客户文件 下载文件*/
export const onDownloadFile = (payload) => {
  return createApi({url:`${api}/api/file/download`,
    ...payload
  })
}
