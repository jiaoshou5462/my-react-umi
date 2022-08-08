// 销售任务
import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';

/*获取销售管理列表*/
export const querySaleTaskList = (payload) =>{
  return createApi({
    url:`${api}/api/channel-service/crmTask/taskList`,
    ...payload
  })
}

/*获取所属渠道*/
export const queryChannelList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/queryCustomerChannelByChannelId`,
    ...payload
  })
};

/* 销售任务立即开始 && 销售任务立即结束 */
export const isTaskStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTask/taskStatus`,
    ...payload
  })
}

/* 销售任务获取任务分类 */
export const queryTaskType = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTask/type`,
    ...payload
  })
}

/* 销售任务复制 */
export const copyTask = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTask/copyTask`,
    ...payload
  })
}

// 销售任务删除任务
export const deleteTask = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/deleteTask/${payload.taskId}/${payload.createUser}`,
    ...payload
  })
}

// 销售任务 基础信息保存与修改
export const saveTask = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/saveCrmTaskInfo`,
    ...payload
  })
}

// 销售任务 查询任务信息
export const queryTaskInfo = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/crmTaskInfo/${payload.taskId}`,
    ...payload
  })
}

// 销售任务 选择卡券
export const getCouponList = (payload) => {
  return createApi({
    url: `${api}/api/purchase/quotation/selectChannelCoupon`,
    ...payload
  })
}

// 销售任务 保存-修改任务详情信息(设置任务kpi与奖励)
export const saveCrmTaskDetailInfo = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskDetail/saveCrmTaskDetailInfo`,
    ...payload
  })
}

// 销售任务 扫码获客
export const qeGuideGetList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/queryQrCode`,
    ...payload
  })
}

// 销售任务 导入销售账户
export const saleImportExcel = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/saleImportExcel`,
    ...payload
  })
}

// 销售任务 查询销售列表
export const queryTaskSaleKpiList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/queryTaskSaleKpiList`,
    ...payload
  })
}

// 销售任务
export const queryTaskKpiWeight = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/queryTaskKpiWeight`,
    ...payload
  })
}

// 销售任务 第四步 完成   任务回显
export const completeTaskId = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/complete/${payload.taskId}`,
    ...payload
  })
}

// 销售任务 文章推广
export const getNewsByIdOrTitle = (payload) => {
  return createApi({
    // url:`${api}/api/channel-service/crmTask/getNewsByIdOrTitle`,
    url: `${api}/api/channel-service/crmNews/getNewsByIdOrTitle`,
    ...payload
  })
}

// 销售任务 下载文件
export const onDownloadFile = (payload) => {
  return createApi({
    url:`${api}/api/file/download`,
    ...payload
  })
}

// 销售任务  第二步查询
export const queryTaskDetailInfo = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskDetail/crmTaskDetailInfo/${payload.taskId}`,
    ...payload
  })
}

// 销售任务  下载错误文件
export const downloadTaskExcel = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/queryExcelInfo`,
    ...payload
  })
}

// 销售任务  分配员工删除
export const deleteTaskId = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/deleteKpi`,
    ...payload
  })
}

/*产品列表*/
export const getListProductData = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTaskPrduct/taskProductInfo`,
    ...payload
  })
}

// 数据看板-查询任务相关门店列表
export const getTaskBranchList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskRankDataBoard/findTaskBranch`,
    ...payload
  })
}

// 数据看板-查询任务相关团队列表
export const getTaskTeamList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskRankDataBoard/findTaskTeam`,
    ...payload
  })
}

// 数据看板-查询当前任务完成度
export const getTaskFinishDegree = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskRankDataBoard/findTaskFinishDegree`,
    ...payload
  })
}

// 数据看板-查询任务完成度趋势-折线图
export const getTaskFinishTrend = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskRankDataBoard/findTaskFinishTrend`,
    ...payload
  })
}

// 数据看板-下载当前任务门店-团队-个人排行
export const onDownloadTaskRank = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskRankDataBoard/downloadTaskRank`,
    ...payload
  })
}

// 数据看板-查询当前任务门店-团队-个人排行
export const getTaskRankList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskRankDataBoard/findTaskRankPage`,
    ...payload
  })
}

// 查询客户人群批次 列表
export const getTaskCustomerCrowdList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskDetail/taskCustomerCrowd`,
    ...payload
  })
}

// 查询客户人群批次 人数
export const getCrowdBatchCount = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTaskDetail/crowdBatchCount`,
    ...payload
  })
}

// 任务部分销售弹窗 查询销售
export const getModalSaleList = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/querySaleList`,
    ...payload
  })
}

// 任务部分销售弹窗 添加销售
export const addModalSale = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/sectionSaleImport`,
    ...payload
  })
}

// 销售任务  查询当前渠道是否开通企微
export const getWeWorkAuth = (payload) => {
  return createApi({
    url:`${api}/api/channel-service/crmTask/weWorkAuth`,
    ...payload
  })
}




























