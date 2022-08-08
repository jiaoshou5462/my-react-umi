import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/*公共查询接口*/

// 查询服务商/供应商列表
export const getProviderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/queryProviderList`,
    ...payload
  })
}
// 查询分支机构列表
export const getBranchList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/selectDictionary/${payload.id}`,
    ...payload
  })
}
// 查询洗车和安全检测门店
export const getStoreList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/inspectLocationPage`,
    ...payload
  })
}

// 查询 服务类型、服务项目、方位、故障类型、车型、颜色、保险公司、省市区、承保单位 字典接口
export const getConfigCode = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/code/configCode`,
    ...payload
  })
}

// 查询 渠道接口
export const getChannelList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/channel/getChannelBySelectPage`,
    ...payload
  })
}

// 查询 供应商接口
export const getUserProviderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/getUserProviderList`,
    ...payload
  })
}
// 查询 车辆品牌列表
export const getCarBrandList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/carBrand/findCarBrandList`,
    ...payload
  })
}
// 查询 车辆车系列表
export const getCarModelList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/carModel/findCarModelList`,
    ...payload
  })
}

/*
* 代驾订单
* */

//代驾订单列表
export const getDriverOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/driverOrder/page`,
    ...payload
  })
}
//代驾订单详请
export const getDriverOrderDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/driverOrder/queryById`,
    ...payload
  })
}

/*
* 洗车订单
* */

//洗车订单列表
export const getCarWashOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/washCarOrder/page`,
    ...payload
  })
}
//洗车订单详请
export const getCarWashOrderDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/washCarOrder/queryById`,
    ...payload
  })
}

/*
* 安全检测订单
* */

//安全检测订单列表
export const getSafetyInspectOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/safetyInspectOrder/page`,
    ...payload
  })
}
//安全检测订单详请
export const getSafetyInspectOrderDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/safetyInspectOrder/queryById`,
    ...payload
  })
}

/*
* 代步车订单
* */
//代步车订单列表
export const getScooterOrderList = (payload) =>{
  return createApi({
    url: `${api}/api/channel-service/rentOrder/page`,
    ...payload
  })
}
//代步车订单详情
export const getScooterOrderDetail = (payload) =>{
return createApi({
  url: `${api}/api/channel-service/rentOrder/queryById`,
    ...payload
})
}

/*
* 货运申报订单
* */
//货运申报订单列表
export const getCargoDeclarationOrderList = (payload) =>{
  return createApi({
    url: `${api}/api/channel-service/freightOrder/page`,
    ...payload
  })
}

/*
* 油卡充值订单
* */
//油卡充值订单列表
export const getRechargeCardOrderList = (payload) =>{
  return createApi({
    url: `${api}/api/channel-service/rechargeOrder/page`,
    ...payload
  })
}
//油卡充值订单详情
export const getRechargeCardOrderDetail = (payload) =>{
return createApi({
  url: `${api}/api/channel-service/rechargeOrder/queryById`,
    ...payload
})
}

/*
* 保养订单
* */
//保养订单列表
export const getMaintainOrderList = (payload) =>{
  return createApi({
    url: `${api}/api/channel-service/maintainOrder/page`,
    ...payload
  })
}
//保养订单详情
export const getMaintainOrderDetail = (payload) =>{
return createApi({
  url: `${api}/api/channel-service/maintainOrder/queryById`,
    ...payload
})
}

/*
* E养车保养订单
* */
//E养车订单列表
export const getEmaintOrderList = (payload) =>{
  return createApi({
    url: `${api}/api/channel-service/maintOrder/page`,
    ...payload
  })
}
//E养车订单详情
export const getEmaintOrderDetail = (payload) =>{
return createApi({
  url: `${api}/api/channel-service/maintOrder/queryById`,
    ...payload
})
}
//E养车门店列表
export const raiseCarPaintSelectList = (payload) =>{
  return createApi({
    url: `https://dev.yltapi.com/api/maintService/maintOther/queryList`,
      ...payload
  })
  }

/*
* 代办年检订单
* */

//代办年检订单列表
export const getAgentOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/motOrder/page`,
    ...payload
  })
}
//代办年检订单详请
export const getAgentOrderDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/motOrder/queryById`,
    ...payload
  })
}


/*救援订单*/

//救援订单列表
export const getRescueOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/selectPage`,
    ...payload
  })
}
//救援订单列表
export const getRescueOrderDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/detail`,
    ...payload
  })
}
//救援订单 案件多段线搜索（详情地图相关）
export const getCasePolylineSearch = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/casePolylineSearch`,
    ...payload
  })
}
//救援订单 加载到达点的index（详情地图相关）
export const getLoadArrivedPointIndex = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/loadArrivedPointIndex`,
    ...payload
  })
}
//救援订单 加载案件时间线（详情地图相关）
export const getLoadCaseTimeline = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/loadCaseTimeline`,
    ...payload
  })
}
//导出救援订单
export const getExportCaseList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/exportCaseList`,
    ...payload
  })
}
//新增救援订单
export const addRescueOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/save`,
    ...payload
  })
}
//修改救援订单
export const reviseRescueOrderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/update`,
    ...payload
  })
}
//救援订单催促
export const rescueOrderUrge = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/urge`,
    ...payload
  })
}
//救援备注
export const rescueOrderRemark = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/remark`,
    ...payload
  })
}
//取消救援订单
export const rescueOrderCancel = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/cancel`,
    ...payload
  })
}
//地址反写省市区
export const addressAnalyze = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/rescueOrder/addressAnalyze?caseAddress=${payload.caseAddress}`,
    ...payload
  })
}

/*
* 鲜花订单
* */
//鲜花订单列表
export const getFlowerOrderList = (payload) =>{
  return createApi({
    url: `${api}/api/channel-service/flowerOrder/page`,
    ...payload
  })
}
//鲜花订单详情
export const getFlowerOrderDetail = (payload) =>{
return createApi({
  url: `${api}/api/channel-service/flowerOrder/queryById`,
    ...payload
})
}
/*
* 产品订单
* */
//产品订单列表
export const getProductOrderList = (payload) =>{
  return createApi({
    url: `${api}/api/channel-service/product/productOrderInfo`,
    ...payload
  })
}
