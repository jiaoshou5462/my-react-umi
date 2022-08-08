import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';

// 1弹窗内容
/*弹窗内容列表查询*/
export const listPopupContent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupContent/listPopupContent`,
    ...payload
  })
};

// 1启用-2停用-3删除弹窗内容
export const updatePopupContent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupContent/updatePopupContent`,
    ...payload
  })
};
// 保存弹窗内容
export const savePopupContent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupContent/savePopupContent`,
    ...payload
  })
};

// 查看弹窗内容详情(查看数据信息)
export const detailPopupContentRecord = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupContent/detailPopupContentRecord`,
    ...payload
  })
};
// 查看弹窗内容详情(查看任务明细)
export const detailPopupContentRecordId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupContent/detailPopupContentRecord/${payload.id}`,
    ...payload
  })
};

// 查看弹窗内容详情(编辑)
export const detailPopupContent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupContent/detailPopupContent/${payload.id}`,
    ...payload
  })
};

// 2定向弹窗
/*查询定向弹窗分页*/
export const queryPopupDirectPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupDirect/queryPopupDirectPage`,
    ...payload
  })
};

// 弹窗页面配置列表
export const popupPageConfig = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupPageConfig/list`,
    ...payload
  })
};
// 启用前验证
export const validateAfterEnable = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupDirect/validateForEnable/${payload.id}`,
    ...payload
  })
};
// 启用-停用
export const updateStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupDirect/updateStatus`,
    ...payload
  })
};

// 删除定向弹窗
export const deleteId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupDirect/delete/${payload.id}`,
    ...payload
  })
};

// 新增或保存
export const saveOrUpdate = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupDirect/saveOrUpdate`,
    ...payload
  })
};

// 消息详情
export const detailId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupDirect/detail/${payload.id}`,
    ...payload
  })
};
// 3弹窗调用记录列表查询
export const listPopupRecord = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/popupTouchRecord/listPopupRecord`,
    ...payload
  })
};
