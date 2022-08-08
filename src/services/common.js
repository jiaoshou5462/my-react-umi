import {request, localRequest} from "@/utils/request";
let APIs = {
  /*下拉查询公共接口*/
    "getProvider": "/purchase/coupon/getProvider", //查询供应商
    "getChannel": "/purchase/coupon/getAllChannel", //查询渠道
    "getOuterCard": "/purchase/coupon/outerCardList", //查询外部券接口
    "getCategory": "/coupon/couponSku/category/selectPage", //查询卡券品类（服务）
    "getTag": "/coupon/couponSku/tag/selectPage", //查询标签
    /*页面接口*/
    "contractSelectPage": "/purchase/contract/selectPage",
    "contractAdd": "/purchase/contract/add",
    "getAllChannel": "/purchase/coupon/getAllChannel", //获取渠道数据
    "selectByNo": "/purchase/contract/select/", //获取合同详情
    "updateContract": "/purchase/contract/update", //编辑合同
    "getPurchaseList": "/purchase/purchaseOrder/selectPage", //采购订单列表
    "addPurchaseOrder": "/purchase/purchaseOrder/add", //保存采购订单
    "submitPurchaseOrder": "/purchase/purchaseOrder/submit", //提交采购订单
    "editPurchaseOrder": "/purchase/purchaseOrder/update", //采购订单编辑
    "getPurchaseDetail": "/purchase/purchaseOrder/select", //获取采购订单详请
    "getPurchaseDetailContract": "/purchase/purchaseOrder/selectContract", //查询采购订单关联的合同
    "delPurchaseDetailContract": "/purchase/purchaseOrder/removeContract", //删除采购订单关联合同
    "getPurchaseDetailProduct": "/purchase/purchaseOrder/selectProduct", //查询采购订单关联的商品
    "delPurchaseDetailProduct": "/purchase/purchaseOrder/removeProduct", //删除采购订单关联商品
    "addPurchaseProduct": "/purchase/purchaseOrder/addProduct", //新增采购订单关联商品
    "getPurchaseProduct": "/purchase/purchaseOrder/findProduct", //查询采购订单商品详请
    "editPurchaseProduct": "/purchase/purchaseOrder/editProduct", //查询采购订单商品详请
    "addPurchaseContract": "/purchase/purchaseOrder/addContract", //添加采购订单关联合同
    "getSelectPurContract": "/purchase/purchaseOrder/selectContract", //查询采购订单关联的合同
    "onDiscard": "/purchase/purchaseOrder/obsolete", //采购订单作废
    "updateOrder": "/purchase/purchaseOrder/updateOrder", //采购订单上传订单
    "getAuditList": "/purchase/purchaseOrder/audit/selectPage", //采购订单审核通过
    "onAuditPass": "/purchase/purchaseOrder/audit/pass", //采购订单审核通过
    "onAuditReject": "/purchase/purchaseOrder/audit/reject", //采购订单审核驳回
    "getPutList": "/purchase/inboundOrder/selectPage", //入库分页列表
    "getPutProductList": "/purchase/inboundOrder/selectProductPage", //入库商品分页列表
    "onPutProduct": "/purchase/inboundOrder/putStorage", //入库
    "getPutDetail": "/purchase/inboundOrder/select", //入库单详请
    "getCardSelect": "/coupon/couponProduct/selectPage", //卡券产品分页列表
    "addBasicCard": "/coupon/couponSku/add", //新增基础卡券
    "getCategoryBasicCard": "/coupon/couponSku/category/selectPage", //卡券品类分页列表
    "getBasicCardList": "/coupon/couponSku/selectPage", //基础卡券分页列表
    "onLoseEffect": "/coupon/couponSku/disable", // 卡券失效
    "onTakeEffect": "/coupon/couponSku/enable", // 卡券生效
    "getBasicCardDetail": "/coupon/couponSku/select", // 获取卡券详请
    "editBasicCard": "/coupon/couponSku/update", // 编辑卡券
    "getAllOuterCardList": "/provider/providerService/allOuterCardList", // 查询所有外部券列表
    "getProviderProductCard": "/provider/providerService/selectProviderProductCard", // 查询自营采购库卡券数量

    "getProviderProductList": "/provider/providerProduct/pageProviderProductList",//查询供应商卡券产品
    "getRechargeProductList": "/provider/providerProduct/pageRechargeProductList",//查询供应商直充产品
    "addProviderProduct": "/provider/providerProduct/addProviderProduct",//新增供应商卡券产品
    "addRechargeProduct": "/provider/providerProduct/addRechargeProduct",//新增供应商直充产品
    "providerProductDetail": "/provider/providerProduct/providerProductDetail",//供应商卡券产品详情
    "rechargeProductDetail": "/provider/providerProduct/rechargeProductDetail",//供应商直充产品详情
    "editProviderProduct": "/provider/providerProduct/editProviderProduct",//编辑供应商卡券产品
    "editRechargeProduct": "/provider/providerProduct/editRechargeProduct",//编辑供应商直充产品
    "operationProviderProduct": "/provider/providerProduct/operationProviderProduct",//供应商卡券产品操作
    "operationRechargeProduct": "/provider/providerProduct/operationRechargeProduct",//供应商直充产品操作
};
let ContentArr = {
    'json': 'application/json',
    'form_data': 'application/x-www-form-urlencoded'
};
/**
 * get请求
*/
export function GetDataEvent({api,params={},ContentType='form_data'}){
    return request(APIs[api] ,{
      data: ContentType === 'form_data' ? params : JSON.stringify(params),
      headers: {
        "Content-Type": ContentArr[ContentType],
        "Cache-Control": 'no-cache'
      }
    });
}
/**
 * post请求
*/
export function PostDataEvent({api,params={},ContentType='form_data'}){
    return request(APIs[api], {
      method: 'POST',
      data: ContentType === 'form_data' ? params:JSON.stringify(params),
      headers: {
        "Content-Type": ContentArr[ContentType],
        "Cache-Control": 'no-cache'
      }
    });
}
/**
 * Get请求
 * url拼接模式( /api/params)
*/
export function GetUrlData({api,params={},ContentType='form_data'}){
  let url = `${APIs[api]}/${params.param}`;
    return request(url, {
      data: {},
      headers: {
        "Content-Type": ContentArr[ContentType],
        "Cache-Control": 'no-cache'
      }
    });
}
/**
 * Put请求
 * url拼接模式( /api/params)
*/
export function PutUrlData({api,params={},ContentType='form_data'}){
  let url = `${APIs[api]}/${params.param}`;
    return request(url, {
      data: {},
      method: 'PUT',
      headers: {
        "Content-Type": ContentArr[ContentType],
        "Cache-Control": 'no-cache'
      }
    });
}
/**
 * Put请求
*/
export function PutDate({api,params={},ContentType='form_data'}){
  return request(APIs[api], {
    method: 'PUT',
    data: ContentType === 'form_data' ? params : JSON.stringify(params),
    headers: {
      "Content-Type": ContentArr[ContentType]
    }
  });
}

/**
 * 联调本地接口
 */
export function localPost({api,params={}}, ContentType = 'json'){
  return localRequest(APIs[api], {
    method: 'POST',
    data: params,
    headers: {
      "Content-Type": ContentArr[ContentType]
    }
  })
}
