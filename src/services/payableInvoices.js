import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';


/*查询应付及发票列表*/
export const getPayableAndInvoiceList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBill/getPayableAndInvoiceList`,
    ...payload
  })
};

/*查询发票详情*/
export const getInvoiceDetails = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillInvoice/getInvoiceDetails/${payload.billNo}`,
    ...payload
  })
};

/*查询付款详情*/
export const getPaymentDetails = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillInvoice/getPaymentDetails/${payload.billNo}`,
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

// 获取快递详情
export const getExpressDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelBalanceBillInvoice/selectInvoiceExpress`,
    ...payload
  })
};