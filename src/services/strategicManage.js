import {api} from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/* 获取策略列表信息 */
export const queryWanderList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryWanderList`,
    ...payload
  })
}

/* 删除策略列表 */
export const deleteWander = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/deleteWander/${payload.params.id}`,
    ...payload
  })
}

/* 保存策略 */
export const saveWanderInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/saveWanderInfo`,
    ...payload
  })
}

/* 修改营销策略状态 */
export const updateStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/updateStatus`,
    ...payload
  })
}

/*查询营销项目*/
export const listMarketProject = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/listMarketProject`,
    ...payload
  })
};

/* 查询人群 */
export const queryCrowdByStrategyId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryCrowdByStrategyId`,
    ...payload
  })
};

/* 场景模板列表接口 */
export const getSceneTemplateList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSceneTemplate/getMarketingSceneTemplateList`,
    ...payload
  })
};
/* 保存模板*/
export const saveTemplate = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSceneTemplate/saveSceneTemplate`,
    ...payload
  })
};

/* 获取模板详情 */
export const getSceneTemplateListDetail = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/detail`,
    ...payload
  })
}
// 弹窗获取选择场景模板详情
export const getEditSceneTemplate = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/getSceneTemplateDetailInfo`,
    ...payload
  })
}
// - 弹窗内模板详情
export const getSceneDetail = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/getMarketingSceneTemplateDetailInfo`,
    ...payload
  })
}

// 编辑获取模板详情
export const getMarketingSceneTemplate = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/getMarketingSceneTemplate`,
    ...payload
  })
}

/* 公众号选择接口 */
export const getAppSettingListByChannelId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wechat/wechatAppSetting/getAppSettingListByChannelId`,
    ...payload
  })
};

/* 接口 */
export const findSceneTypeVariableList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelWechatSceneTemplate/findSceneTypeVariableList`,
    ...payload
  })
};

/* 外层卡券列表 */
export const listWanderGrantBatch = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/listWanderGrantBatch`,
    ...payload
  })
};
/* 内层卡券列表 */
export const listWanderGrantBatchDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/grantBatch/listWanderGrantBatchDetail`,
    ...payload
  })
};
/* 编辑回显 */
export const queryWanderStrategyById = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryWanderStrategyById/${payload.params.id}`,
    ...payload
  })
};

/* 策略统计详情 */
export const queryStrategyDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryStrategyDetail/${payload.params.id}`,
    ...payload
  })
};

/* 趋势分析列表 */
export const queryStrategyDetailList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryStrategyDetailList`,
    ...payload
  })
};

/* 触发条件数据 */
export const queryTriggerSence = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryTriggerSence`,
    ...payload
  })
};

/* 获取进行中的活动数据 */
export const queryActivityList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/queryActivityList`,
    ...payload
  })
};

/* 获取中奖类型 */
export const queryPrize = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryPrize`,
    ...payload
  })
};

/* 触发记录-触发场景下拉 */
export const queryTriggerConfigList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryTriggerConfigList`,
    ...payload
  })
}; 

/* 触发记录-列表 */
export const queryTriggerRecordList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryTriggerRecordList`,
    ...payload
  })
};

/*触发记录-页面浏览列表*/
export const queryPageBrowing = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wanderStrategy/queryPageBrowing`,
    ...payload
  })
};