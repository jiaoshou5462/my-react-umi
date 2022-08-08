import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/*
* 卡券明细查询
* */

//卡券明细查询列表
export const getCardDetailList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDetail/getCardOperationList`,
    ...payload
  })
}
//卡券明细 筛选下拉数据
export const getQueryList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDetail/getCardOperationConditions`,
    ...payload
  })
}
//卡券明细 获取卡券导出code
export const onImportExcelCode = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDetail/importExcel`,
    ...payload
  })
}
//卡券明细 导出卡券文件
export const onImportExcelFile = (payload) => {
  return createApi({
    url: `${api}/api/file/third/download`,
    ...payload
  })
}
//删除卡券
export const deleteCouponDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDetail/deleteCouponDetail`,
    ...payload
  })
}
//查看卡券详情
export const queryCouponDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/couponDetail/queryCouponDetail`,
    ...payload
  })
}