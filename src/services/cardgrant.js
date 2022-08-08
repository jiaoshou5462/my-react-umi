import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';


/*查询所有渠道接口*/
export const getAllChannel = (payload) => {
  return createApi({
    url: `${api}/octopus/coupon/getAllChannel`,
    ...payload
  })
};
/*查询品类列表接口*/
export const category = (payload) => {
  return createApi({
    url: `${api}/api/coupon/couponSku/category/selectPage`,
    ...payload
  })
};
/*额度*/
export const complateQuato = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/complateQuato`,
    ...payload
  })
};
/*卡券投放列表*/
export const listGrantBatch = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/listGrantBatch`,
    ...payload
  })
};
// 查询使用人数
export const queryUseCount = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/queryUseCount/${payload.grantBatchId}`,
    ...payload
  })
};

// 发放记录
export const queryGrantDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/queryGrantDetail/${payload.grantBatchId}`,
    ...payload
  })
};
// 发放记录-->导出名单
export const importNameList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/importExcel`,
    // responseType: 'blob',
    ...payload
  })
};
// 文件下载
export const download = (payload) => {
  return createApi({
    url: `${api}/api/file/download?fileCode=${payload.fileCode}`,
    ...payload
  })
};
// 撤回发放
export const withdraw = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/withdraw`,
    ...payload
  })
};

/*卡券投放展开子列表*/
export const listGrantBatchDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/listGrantBatchDetail`,
    ...payload
  })
};
// 新增
export const addGrantBatch = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/addGrantBatch`,
    ...payload
  })
};
// 上传名单
export const uploadSingle = (payload) => {
  return createApi({
    url: `${api}/api/file/upload/single`,
    ...payload
  })
};
// 上传名单之后的数据
export const checkExcelData = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/checkExcelData`,
    ...payload
  })
};

// SKU下拉
export const selectChannelSku = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/quotation/selectChannelSku`,
    ...payload
  })
};

// 根据渠道查询渠道已报价基础卡券
export const selectChannelCoupon = (payload) => {
  return createApi({
    // url: `${api}/api/channel-service/quotation/selectChannelCoupon`, // old
    url: `${api}/api/channel-service/quotation/selectChannelCouponNew`,// new
    ...payload
  })
};



/*查询全部营销活动接口*/
export const listMarketProject = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/listMarketProject`,
    ...payload
  })
};

// 基础卡包
export const selectChannelCouponPackage = (payload) => {
  return createApi({
    // url: `${api}/api/channel-service/quotation/selectChannelCouponPackage`,// old
    url: `${api}/api/channel-service/quotation/selectChannelCouponPackageNew`,// new
    ...payload
  })
};

// 基础卡包-卡包ID下拉框数据
export const queryPackage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/quotation/queryPackage`,
    ...payload
  })
};

// 卡包详情
export const queryCardByPackageNo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponCenter/queryCardByPackageNoNew?packageNo=${payload.packageNo}&quotationItemId=${payload.quotationItemId}`,
    ...payload
  })
};

// 卡包明细
export const queryCardByPackageNoNotGroupByCouponNum = (payload) => {
  return createApi({
    // url: `${api}/api/channel-service/couponCenter/queryCardByPackageNoNotGroupByCouponNum?packageNo=${payload.packageNo}`,// old
    url: `${api}/api/channel-service/couponCenter/queryCardByPackageNoNotGroupByCouponNumNew?packageNo=${payload.packageNo}&quotationItemId=${payload.quotationItemId}`,// new
    ...payload
  })
};


/*批次生效*/
export const startEffect = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/startEffect/${payload.grantBatchId}`,
    ...payload
  })
};

/*批次信息*/
export const startInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/info/${payload.grantBatchId}`,
    ...payload
  })
};

/*查看兑换码信息*/
export const verifyCode = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/verifyCode/info/${payload.grantBatchId}`,
    ...payload
  })
};

/*查看兑换码文件密码信息*/
export const verifyCodeFilePass = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/verifyCodeFilePass`,
    ...payload
  })
};

// 撤回文案
export const confirmWithdraw = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/confirmWithdraw`,
    ...payload
  })
};

// 复制批次
export const grantCopy = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/copy/${payload.grantBatchId}`,
    ...payload
  })
};

// 删除
export const grantDelete = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/delete/${payload.grantBatchId}`,
    ...payload
  })
};

// 失效
export const grantInvalid = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/invalid/${payload.grantBatchId}`,
    ...payload
  })
};

// 查询已报价管理查询列表
export const getSelectChannelCardAndCardPackage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/quotation/selectChannelCardAndCardPackage`,
    ...payload
  })
};

// 查询已报价管理(卡券卡包详情)
export const queryGrantBatchPutCount = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/queryPutCount`,
    ...payload
  })
};