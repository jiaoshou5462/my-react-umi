/*预采投放管理*/
import {api} from './env-config.js' //环境变量
import {createApi} from '@/utils/axios.js' //环境变量

/*获取供应商*/
export const getProvider = (payload) =>{
  return createApi({url:`${api}/api/purchase/coupon/getProvider`,
    ...payload
  })
}
/*查询供应商产品*/
export const getProviderProduct = (payload) =>{
  return createApi({url:`${api}/api/provider/product/selectDispatchProduct`,
    ...payload
  })
}
/*查询自营平台产品*/
export const getCarServiceProduct = (payload) =>{
  return createApi({url:`${api}/api/provider/product/selectDispatchProduct/carService`,
    ...payload
  })
}
/*新增sku产品*/
export const addSkuProduct = (payload) =>{
  return createApi({url:`${api}/api/provider/product/add`,
    ...payload
  })
}
/*SKU列表*/
export const skuManagementList = (payload) =>{
  return createApi({url:`${api}/api/provider/product/selectPage`,
    ...payload
  })
}
/*启用sku产品*/
export const onSkuEnable= (payload) =>{
  return createApi({url:`${api}/api/provider/product/enable`,
    ...payload
  })
}
/*停用sku产品*/
export const onSkuDisable = (payload) =>{
  return createApi({url:`${api}/api/provider/product/disable`,
    ...payload
  })
}
/*查询sku产品详情*/
export const getSkuProductDetail = (payload) =>{
  return createApi({url:`${api}/api/provider/product/detail`,
    ...payload
  })
}
/*关联sku三方信息*/
export const updateSkuDetail = (payload) =>{
  return createApi({url:`${api}/api/provider/product/editDispatchMapping`,
    ...payload
  })
}
/*编辑sku产品详情*/
export const updateSku = (payload) =>{
  return createApi({url:`${api}/api/provider/product/edit`,
    ...payload
  })
}
/*sku定价列表*/
export const skuPricingList = (payload) =>{
  return createApi({url:`${api}/api/provider/product/selectPricingPage`,
    ...payload
  })
}
/*查询sku定价详情*/
export const getSkuPricingDetail = (payload) =>{
  return createApi({url:`${api}/api/provider/product/pricingDetail`,
    ...payload
  })
}
/*编辑sku定价*/
export const editSkuPricing = (payload) =>{
  return createApi({url:`${api}/api/provider/product/editPricing`,
    ...payload
  })
}

/*基础卡券定价列表*/
export const basicCardPricingList = (payload) =>{
  return createApi({url:`${api}/api/coupon/couponSku/selectPricingPage`,
    ...payload
  })
}
/*查询基础卡券定价详情*/
export const getBasicCardPricingDetail = (payload) =>{
  return createApi({url:`${api}/api/coupon/couponSku/pricingDetail`,
    ...payload
  })
}
/*编辑sku定价*/
export const editBasicCardPricing = (payload) =>{
  return createApi({url:`${api}/api/coupon/couponSku/editPricing`,
    ...payload
  })
}
/*查询卡券品类*/
export const getBasicCardCategory = (payload) =>{
  return createApi({url:`${api}/api/coupon/couponSku/category/selectPage`,
    ...payload
  })
}

/*
* 报价管理模块
*/
/*报价管理列表*/
export const getQuotationManageList = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/selectInfoPage`,
    ...payload
  })
}
/*新增报价管理*/
export const addQuotationManage = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/addInfo`,
    ...payload
  })
}
/*报价管理详请*/
export const getQuotationManageDetail = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/findInfoByNo`,
    ...payload
  })
}
/*编辑报价管理*/
export const editQuotationManage = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/updateInfo`,
    ...payload
  })
}
/*提交报价管理*/
export const onSubmitQuotationManage = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/submitInfo`,
    ...payload
  })
}
/*删除报价管理*/
export const delQuotationManage = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/delInfo`,
    ...payload
  })
}
/*报价明细详请*/
export const getQuotationItem = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/selectItem`,
    ...payload
  })
}
/*删除报价明细*/
export const delQuotationItem = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/delItem`,
    ...payload
  })
}
/*根据基础卡券编号查询报价*/
export const getCardQuotation = (payload) =>{
  return createApi({url:`${api}/api/coupon/couponSku/selectPricingPrice`,
    ...payload
  })
}
/*新增据实报价明细*/
export const addItemFact = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/addItemFact`,
    ...payload
  })
}
/*删除据实报价明细*/
export const delItemFact = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/delItemFact`,
    ...payload
  })
}
/*查询据实报价明细详情*/
export const getItemFactDetail = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/findItemFact`,
    ...payload
  })
}
/*编辑据实报价明细*/
export const editItemFact = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/updateItemFact`,
    ...payload
  })
}
/*查询据实服务报价清单*/
export const getItemFactList = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/selectItemFact`,
    ...payload
  })
}
/*报价单适用范围树*/
export const getFactAreaList = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/selectFactRegion`,
    ...payload
  })
}

/*软件服务sku 维护管理 定价 报价*/
/*软件服务sku列表*/
export const getSkuSoftwareList = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/product/list`,
    ...payload
  })
}
/*新增软件服务sku*/
export const addSkuSoftware = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/product/addProduct`,
    ...payload
  })
}
/*软件服务sku详请*/
export const getSkuSoftwareDetail = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/product/getByProductNo`,
    ...payload
  })
}
/*编辑软件服务sku*/
export const editSkuSoftware = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/product/update`,
    ...payload
  })
}
/*软件服务sku 修改状态*/
export const editSkuSoftwareStatus = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/product/updateStatus`,
    ...payload
  })
}
/*软件服务sku 内容清单*/
export const getSoftwareContentList = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContent/page`,
    ...payload
  })
}
/*软件服务sku 新增内容清单*/
export const addSoftwareContent = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContent/add`,
    ...payload
  })
}
/*软件服务sku 编辑内容清单*/
export const editSoftwareContent = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContent/update`,
    ...payload
  })
}
/*软件服务sku 内容清单修改状态*/
export const editSoftwareContentStatus = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContent/updateStatus`,
    ...payload
  })
}
/*软件服务定价列表*/
export const getSoftwarePriceList = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContentPrice/list`,
    ...payload
  })
}
/*软件服务定价 未定价内容列表*/
export const getSoftwareNotPricing = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContentPrice/notPricing`,
    ...payload
  })
}
/*软件服务定价 定价接口 新增*/
export const onAddSoftwarePricing = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContentPrice/pricing`,
    ...payload
  })
}
/*软件服务定价 定价接口 编辑*/
export const onEditSoftwarePricing = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContentPrice/yetPricingUpdate`,
    ...payload
  })
}
/*软件服务定价 已定价列表*/
export const getSoftwarePricedList = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContentPrice/yetPricing`,
    ...payload
  })
}
/*软件服务定价 撤销已定价*/
export const onRevokeSoftwarePriced = (payload) =>{
  return createApi({url:`${api}/api/coupon/saas/productContentPrice/repealPricing`,
    ...payload
  })
}
/*获取软件服务报价详请*/
export const getQuotationSoftwareDetail = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/selectItemSaas`,
    ...payload
  })
}
/*增值服务SKU列表*/
export const getSkuVatList = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/product/list`,
    ...payload
  })
}
/*增值服务SKU 启用/停用*/
export const editSkuVatStatus = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/product/updateStatus`,
    ...payload
  })
}
/*新增 增值服务SKU*/
export const addSkuVat = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/product/add`,
    ...payload
  })
}
/*编辑 增值服务SKU*/
export const editSkuVat = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/product/update`,
    ...payload
  })
}
/*增值服务SKU 详请*/
export const getSkuVatDetail = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/product/info`,
    ...payload
  })
}
/*增值服务SKU 定价管理列表*/
export const getVatPriceList = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/productPrice/list`,
    ...payload
  })
}
/*增值服务SKU 定价管理详请*/
export const getVatPriceDetail = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/productPrice/info`,
    ...payload
  })
}
/*新增 增值服务SKU定价*/
export const addVatPrice = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/productPrice/pricing`,
    ...payload
  })
}
/*编辑 增值服务SKU定价*/
export const editVatPrice = (payload) =>{
  return createApi({url:`${api}/api/coupon/vat/productPrice/yetPricingUpdate`,
    ...payload
  })
}
/*新增增值服务报价明细*/
export const addQuotationVatItem= (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/addItemVat`,
    ...payload
  })
}
/*编辑增值服务报价明细*/
export const editQuotationVatItem= (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/updateItemVat`,
    ...payload
  })
}
/*获取增值服务报价明细列表*/
export const getQuotationVatList = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/selectItemVat`,
    ...payload
  })
}
/*获取增值服务报价明细 详请*/
export const getQuotationVatDetail = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/selectItemVatById`,
    ...payload
  })
}
/*删除 获取增值服务报价明细*/
export const delQuotationVatItem = (payload) =>{
  return createApi({url:`${api}/api/purchase/quotation/delItemVat`,
    ...payload
  })
}
/*上传文件*/
export const uploadFile =`${api}/api/purchase/common/updateSignFile`;
