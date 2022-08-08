import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/* 获取客户列表信息 */
export const crmCustomerInfoList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/crmCustomerInfoList`,
    ...payload
  })
}

/* 客户列表导出 */
export const exportCrmCustomer = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/exportCrmCustomer`,
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

/* 查询客户详情 */
export const customerDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/customerDetail`,
    ...payload
  })
}

/* 用户详情 */
export const getSwittch = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/getSwittch`,
    ...payload
  })
}

/* 用户详情优享刷新 */
export const toRefresh = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/toRefresh`,
    ...payload
  })
}
/* 解除绑定 */
export const unbindWechat = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/unbindWechat`,
    ...payload
  })
}

/* 会员日更改 */
export const openAndClosse = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/openAndClosse`,
    ...payload
  })
}

/* 修改手机号和身份证号 */
export const updatePhoneAndCardNo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/updatePhoneAndCardNo`,
    ...payload
  })
}


/* 获取门店信息 - 所属机构 */
export const getBranchInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/branchInfo/${payload.params.channelId}`,
    ...payload
  })
}

/* 获取团队信息 */
export const getTeamInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/teamInfo/${payload.params.branchId}`,
    ...payload
  })
}

//详情页面
/* 查询客户车辆信息 */
export const getCustomerCars = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/getCustomerCars/${payload.params.customerId}`,
    ...payload
  })
}
/* 查询保险信息明细 */
export const getCustomerPolicy = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/getCustomerPolicy`,
    ...payload
  })
}

/* 查询客户卡券信息 */
export const customerCards = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/customerCards`,
    ...payload
  })
}
/* 客户行为次数 */
export const getCustomerBehaviors = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/getCustomerBehaviors`,
    ...payload
  })
}

/* 客户行为时间 */
export const getCustomerBehaviorsByTime = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/getCustomerBehaviorsByTime`,
    ...payload
  })
}

/* 社交圈记录 */
export const interactionRecord = (payload) => {
  return createApi({
    url: `${api}/api/channel-service//crmSaleCustomer/interactionRecord`,
    ...payload
  })
}

/* 社交圈时间 */
export const interactionRecordTime = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/interactionRecordTime`,
    ...payload
  })
}

/* 社交圈图表 */
export const customerSocialCircle = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/customerSocialCircle`,
    ...payload
  })
}

/* 社交圈图表详情 */
export const toSocietyCustomerDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/toSocietyCustomerDetail/${payload.params.customerId}`,
    ...payload
  })
}

/* 用户管理-修改记录 */
export const queryEditRecord = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleCustomer/getWechatCustomerOperLog`,
    // url: `${api}/wechatService/getWechatCustomerOperLog`,
    ...payload
  })
}

// 意见反馈列表
export const queryOpinionFeedBack = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/opinions/queryOpinionFeedBack`,
    ...payload
  })
}

// 意见反馈详情
export const opinionFeedBackDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/opinions/opinionFeedBackDetail/${payload.objectId}`,
    ...payload
  })
}
// 意见反馈提交
export const addOpinionFeedBackReply = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/opinions/addOpinionFeedBackReply`,
    ...payload
  })
}

