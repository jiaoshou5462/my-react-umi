import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';


/*获取所属渠道*/
export const customerChannelList = (payload) => {
  return createApi({
    url: `${api}/api/marketing/LonginCustomer/customerChannelList`,
    ...payload
  })
};

/*获取门店信息*/
export const branchInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/branchInfo/${payload.channelId}`,
    ...payload
  })
};

/*获取团队信息*/
export const teamInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/teamInfo/${payload.branchId}`,
    ...payload
  })
};

/*查询销售列表信息*/
export const saleList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/saleList`,
    ...payload
  })
};

/*查询销售详情信息*/
export const saleInfoDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/saleInfoDetail`,
    ...payload
  })
};

// 导出销售列表信息
export const exportSaleInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/exportSaleInfo`,
    ...payload
  })
};

// 销售行为记录
export const saleBehaviors = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/saleBehaviors`,
    ...payload
  })
};

// 销售行为记录-时间
export const saleBehaviorsByTimes = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/saleBehaviorsByTimes`,
    ...payload
  })
};

// 销售积分统计
export const pointsStatistics = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/pointsStatistics`,
    ...payload
  })
};

// 销售积分明细统计
export const pointsBehaviors = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/pointsBehaviors`,
    ...payload
  })
};

// 销售积分明细统计-时间
export const pointsBehaviorsByBehaviorTime = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/pointsBehaviorsByBehaviorTime`,
    ...payload
  })
};

// 销售套餐
export const saleCardPackages = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/saleCardPackages`,
    ...payload
  })
};

// 销售卡卷
export const saleCards = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/saleCards`,
    ...payload
  })
};

// 客户列表查询标签统计
export const crmCustomerTagCountList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/crmCustomerTagCountList`,
    ...payload
  })
};

// 查询销售信息(数据迁移查询)
export const querySaleInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/saleInfo/${payload.saleId}`,
    ...payload
  })
};

// 销售数据迁移(数据迁移保存)
export const addSaleInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/moveSaleDataToTarget`,
    ...payload
  })
};

// 编辑销售客户查询(销售编辑查询)
export const queryEditSaleInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/editSaleInfo/${payload.userId}`,
    ...payload
  })
};

// 编辑销售保存(销售编辑保存)
export const saveSaleInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/saveSaleInfo`,
    ...payload
  })
};

// 编辑销售获取所属渠道(销售编辑)
export const queryCustomerChannelList = (payload) => {
  return createApi({
    url: `${api}/api/marketing/LonginCustomer/customerChannelList`,
    ...payload
  })
};

// 获取客户列表信息
export const crmCustomerListInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/crmCustomerListInfo`,
    ...payload
  })
};

// 编辑销售获取门店信息(销售编辑)
export const queryBranchInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/branchInfo/${payload.channelId}`,
    ...payload
  })
};

// 编辑销售获取团队信息(销售编辑)
export const queryTeamInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/teamInfo/${payload.branchId}`,
    ...payload
  })
};
// 导入销售账号  (保存)
export const importSaleInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/importSaleInfo`,
    ...payload
  })
};

// 上传销售客户文件
export const addFileTaskInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/fileTask/fileTaskInfo`,
    ...payload
  })
}

// 销售卡卷查询
export const querySaleCards = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/saleCards`,
    ...payload
  })
}

// 销售套餐查询
export const querySaleCardPackages = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManageDetail/saleCardPackages`,
    ...payload
  })
}

// 查询销售下拉搜索信息
export const queryMoveSaleList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/moveSaleList`,
    ...payload
  })
}
// 导入销售校验
export const onImportSaleCheck = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/importSaleCheck`,
    ...payload
  })
}

export const folderCode = `${api}/api/file/upload?folderCode=sale_customer`;

// 同步企微客户
export const onSynchronousWeWork = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/syncWeWorkCustomer`,
    ...payload
  })
}

// 解绑企微
export const onUnbindWeWork = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmSaleManage/unbindWeWork`,
    ...payload
  })
}
