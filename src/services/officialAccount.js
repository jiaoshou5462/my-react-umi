import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';

/*获取所属渠道*/
export const queryChannelList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/queryCustomerChannelByChannelId`,
    ...payload
  })
};
// 公众号自动回复  (条件查询)
export const queryReplyList = (payload) =>{
  return createApi({
    url:`${api}/api/channel-service/wechatCustomerReplyMsg/findListByCondition`,
    ...payload
  })
}

// 公众号自动回复表格删除
export const deleteReplyId = (payload) =>{
  return createApi({
    url:`${api}/api/channel-service/wechatCustomerReplyMsg/deleteReply/${payload.objectId}`,
    ...payload
  })
}

// 公众号保存微信自动回复消息
export const saveReplyData = (payload) =>{
  return createApi({
    url:`${api}/api/channel-service/wechatCustomerReplyMsg/save`,
    ...payload
  })
}

// 公众号更新微信自动回复消息
export const updateReplyData = (payload) =>{
  return createApi({
    url:`${api}/api/channel-service/wechatCustomerReplyMsg/update`,
    ...payload
  })
}

// 获取微信自动回复消息详情
export const detailReplyData = (payload) =>{
  return createApi({
    url:`${api}/api/channel-service/wechatCustomerReplyMsg/detail`,
    ...payload
  })
}

// 文件上传
export const uploadMedia = `${api}/api/channel-service/wechatCustomerReplyMsg/uploadMedia`;

// 模板消息(微信官方MP模板)
export const queryTemplateWechart = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechatTemplate/findListByCondition`,
    ...payload
  })
}
// 模板消息(微信官方MP模板同步接口)
export const syncTemplateFromRemoteService = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechatTemplate/syncTemplateFromRemoteService`,
    ...payload
  })
}
// 模板消息(获取改模板群发消息)
export const queryTemplateByidDetails = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wechatTemplate/findMessageFieldListByTemplateMessageIdAndDeleted/${payload.templateObjectId}`,
    ...payload
  })
}
//  文件上传
export const uploadFile = `${api}/api/file/upload?folderCode=sale_customer`;
// 模板消息(导入)
export const importFilesNumber = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wechatTemplate/importFilesNumberNew`,
    ...payload
  })
}
// 模板消息(微信官方MP模板提交接口后同步)
export const triggerTask = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/wechatTemplate/triggerTask/${payload.objectId}`,
    ...payload
  })
}
// 模板消息(发送历史查询)
export const querySendHistoryeList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechatTemplate/findSendRecord`,
    ...payload
  })
}
// 模板消息(待支付模板消息记录查询)
export const queryBePaidTemplateList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechatTemplate/findUserPolicyRelation`,
    ...payload
  })
}
// 公众号配置查询列表(公众号分页列表)
export const queryConfigureList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppSetting/list`,
    ...payload
  })
}
// 公众号批量失效 参数逗号分隔
export const wechatAppSettingDel = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppSetting/del`,
    ...payload
  })
}
// 公众号配置 (同步菜单)
export const WechatMenuToWechat = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppMenuSetting/createWechatMenuToWechat/${payload.wechatAppId}`,
    ...payload
  })
}
// 公众号配置(查看新增保存接口)
export const saveWechatAppSetting = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppSetting/save`,
    ...payload
  })
}
// 公众号配置(公众号详情点击公众号名称与查看时调用)
export const queryWechatAppSettingDetail = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppSetting/get/${payload.objectId}`,
    ...payload
  })
}
// 公众号配置(设置菜单查询)  菜单列表
export const wechatAppMenuSetting = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppMenuSetting/getChildren`,
    ...payload
  })
}
// 公众号配置(菜单删除)  
export const deleteWechatAppMenuSetting = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppMenuSetting/del/${payload.objectId}`,
    ...payload
  })
}
// 公众号配置(查询菜单类型查询功能类型)
export const querySelectDictionary = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/common/selectDictionary/${payload.dictionaryId}`,
    ...payload
  })
}
// 公众号配置(根据id查询菜单信息)
export const queryWechatAppMenuSetting = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppMenuSetting/get/${payload.objectId}`,
    ...payload
  })
}
// 公众号配置(菜单的保存与更新)
export const saveWechatAppMenuSetting = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppMenuSetting/save`,
    ...payload
  })
}
// 定向投放/场景投放-获取渠道下所属公众号
export const getAppSettingListByChannelId = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechat/wechatAppSetting/getAppSettingListByChannelId`,
    ...payload
  })
}

// 定向投放/场景投放-查询场景模板选择列表
export const getSceneTemplateList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/getSceneTemplateList`,
    ...payload
  })
}


// 定向投放/场景投放-场景模板列表
export const findListByCondition = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelwechatSceneTemplateTask/findListByCondition`,
    ...payload
  })
}


// 定向投放/场景投放-添加变量查询
export const findSceneTypeVariableList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/findSceneTypeVariableList`,
    ...payload
  })
}

// 定向投放/场景投放-定向投放详情接口
export const getTemplateDetail = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelwechatSceneTemplateTask/getTemplateDetail/${payload.objectId}`,
    ...payload
  })
}

// 定向投放/场景投放-删除发送任务
export const deleteTemplate = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelwechatSceneTemplateTask/delete`,
    ...payload
  })
}

// 定向投放/场景投放-启用禁用发送任务
export const updateStatusTemplate = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelwechatSceneTemplateTask/updateStatus`,
    ...payload
  })
}

// 定向投放 新增发放任务
export const saveTemplate = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelwechatSceneTemplateTask/saveTemplate`,
    ...payload
  })
}

// 定向投放 编辑详情接口
export const getSceneDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelwechatSceneTemplateTask/getSceneDetail`,
    ...payload
  })
}
// 文件下载
export const download = (payload) => {
  return createApi({
    url: `${api}/api/file/download?fileCode=${payload.fileCode}`,
    ...payload
  })
};


// 分类变量列表查询
export const getVariableList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/findSceneTypeVariableList`,
    ...payload
  })
}

//查询微信场景模板选择列表
export const getWechatSceneTemplateList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/wechatTemplate/findByDeletedAndWechatAppSettingId`,
    ...payload
  })
}

// 获取场景模板列表
export const SceneTemplateList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/findListByCondition`,
    ...payload
  })
}
// 获取场景模板列表详情
export const getSceneTemplateListDetail = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/detail`,
    ...payload
  })
}
// 停用场景模板
export const StopSceneTemplate = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/updateStatus`,
    ...payload
  })
}
// 删除场景模板
export const deleteSceneTemplate = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/delete/${payload.sceneTemplateId}`,
    ...payload
  })
}
// 获取编辑场景模板详情
export const getEditSceneTemplate = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/getSceneTemplateDetailInfo`,
    ...payload
  })
}
// 新建/编辑场景模板
export const newSceneTemplate = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelWechatSceneTemplate/saveOrUpdate`,
    ...payload
  })
}

// 获取消息记录列表
export const getMessageList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelTemplateMessageLog/findListByCondition`,
    ...payload
  })
}

// 获取消息记录列表详情
export const getMessageDetail = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/channelTemplateMessageLog/detail`,
    ...payload
  })
}

/*查询全部营销活动接口*/
export const listMarketProject = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/listMarketProject`,
    // url: `${api}/api/marketing/marketingProject/listMarketProject`,
    ...payload
  })
};
//活动1-通过大数据获取活动可参与人群
export const getThrongListES = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/getThrongListES`,
    ...payload
  })
}