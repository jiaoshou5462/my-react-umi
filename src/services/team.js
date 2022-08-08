import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

// 查询 团队管理列表
export const getTeamList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManage/teamInfoList`,
    ...payload
  })
}
// 查询 门店列表
export const getStoreList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/branchInfo`,
    ...payload
  })
}
// 导出团队列表信息
export const onExportTeamList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManage/exportTeamInfo`,
    ...payload
  })
}
// 新增/编辑 团队信息
export const addTeam = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManage/saveTeamInfo`,
    ...payload
  })
}
// 校验 新增/编辑 团队信息
export const onCheckAddTeam = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManage/checkTeamInfo`,
    ...payload
  })
}
//新增/编辑 团队长信息查询
export const getTeamUserList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManage/teamUserList`,
    ...payload
  })
}
//获取 编辑团队详请
export const getEditDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManage/editTeamInfo`,
    ...payload
  })
}
//删除团队信息
export const onDeleteTeam = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManage/deleteTeam`,
    ...payload
  })
}
//获取团队信息详情
export const getTeamDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManageDetail/teamInfoDetail`,
    ...payload
  })
}
//获取团队团员列表
export const getTeamSaleList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManageDetail/teamSaleList`,
    ...payload
  })
}
//获取团队客户列表
export const getCustomerList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/crmCustomerListInfo`,
    ...payload
  })
}

/*获取所属渠道*/
export const customerChannelList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/queryCustomerChannelByChannelId`,
    ...payload
  })
};

/*资讯管理-查询选择分类*/
export const crmNewsCategoryList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/crmNewsCategoryList`,
    ...payload
  })
};

/*资讯管理-删除引导内容数据*/
export const delInfomation = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/delete/${payload.newsId}`,
    ...payload
  })
};

/*资讯管理-获取引导内容列表数据*/
export const getNewsList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/getNewsList`,
    ...payload
  })
};

/*资讯管理-获取资讯转发详情列表数据*/
export const queryForwardDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/queryForwardDetail`,
    ...payload
  })
};

/*资讯管理-保存引导内容分类*/
export const saveCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/saveCategory`,
    ...payload
  })
};

/*资讯管理-保存引导内容分类*/
export const saveOrUpdateNews = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/saveOrUpdateNews`,
    ...payload
  })
};

/*资讯管理-停用-启用引导内容*/
export const updateNewsStatus = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/updateNewsStatus`,
    ...payload
  })
};

/*资讯管理-查询海报分类下拉列表*/
export const findPosterCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/findPosterCategory`,
    ...payload
  })
};

/*资讯管理-查询海报分类下拉列表*/
export const findPosterCategoryNew = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/findPosterForQrGuide`,
    ...payload
  })
};

/*资讯管理-查询海报列表*/
export const posterList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/posterList`,
    ...payload
  })
};

/*资讯管理-查询海报列表*/
export const posterListForQrGuide = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/posterListForQrGuide`,
    ...payload
  })
};

/*资讯管理-查询海报列表分类*/
export const findPosterForNewsCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/findPosterForNewsCategory`,
    ...payload
  })
};

/*资讯管理-查询海报列表*/
export const posterListForNews = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/posterListForNews`,
    ...payload
  })
};

/*资讯管理-查询标签接口*/
export const findByChannelId = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmCustomer/findByChannelId`,
    ...payload
  })
};

/*资讯管理-导出资讯转发详情列表数据*/
export const exportForwardInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/exportForwardInfo`,
    ...payload
  })
};


/*资讯管理-查询全部团队*/
export const getTeamInfoByUniway = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmTeamManage/getTeamInfoByUniway`,
    ...payload
  })
};

/*资讯管理-资讯详情*/
export const getNewsDetails = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/getNewsDetails/${payload.newsId}`,
    ...payload
  })
};

/*资讯管理-资讯详情*/
export const uploadIcon = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingMgr/uploadIcon`,
    ...payload
  })
};


/*获客码-列表*/
export const qrGuideList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/qrGuide/qrGuideList`,
    ...payload
  })
};

/*获客码-渠道类型*/
export const getChannelType = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/qrGuide/getChannelType`,
    ...payload
  })
};

/*获客码-渠道分类*/
export const getMonitorFlag = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/qrGuide/getMonitorFlag`,
    ...payload
  })
};

/*获客码-判斷是否为超管*/
export const judgeIsSuperRole = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/judgeIsSuperRole`,
    ...payload
  })
};

/*获客码-删除获客码*/
export const deleteQrGuide = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/qrGuide/deleteQrGuide`,
    ...payload
  })
};


/*获客码-编辑获客码*/
export const editDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/qrGuide/editDetail`,
    ...payload
  })
};

/*获客码-获取微信公众号*/
export const getWechatList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/qrGuide/getWechatList `,
    ...payload
  })
};

/*获客码-新增保存获客码*/
export const addSaveQrGuide = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/qrGuide/saveOrUpdate`,
    ...payload
  })
};


/*产品管理-查询全部分类*/
export const crmProCategoryList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/crmProCategoryList`,
    ...payload
  })
};


/*产品管理-新增分类*/
export const saveProCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/saveProCategory`,
    ...payload
  })
};

/*产品管理-分类编辑*/
export const updateCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/updateCategory`,
    ...payload
  })
};


/*产品管理-删除分类*/
export const deleteCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/deleteCategory/${payload.objectId}`,
    ...payload
  })
};

/*产品管理-关联的产品*/
export const getSupGoodsPage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelSupGoods/getSupGoodsPage`,
    ...payload
  })
};

/*产品管理-关联的产品-详情*/
export const getChannelSupGoodDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelSupGoods/getChannelSupGoodDetail/${payload.objectId}`,
    ...payload
  })
};

/*产品管理-订单类型*/
export const getDictionary = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/common/getDictionary/${payload.dictionaryId}`,
    ...payload
  })
};

/*产品管理-保存产品*/
export const saveProduct = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/saveProduct`,
    ...payload
  })
};

/*产品管理-详情*/
export const getProductInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/getProductInfo/${payload.objectId}`,
    ...payload
  })
};

/*产品管理-列表*/
export const getListProductData = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/getListProductData`,
    ...payload
  })
};

/*产品管理-列表*/
export const crmsDel = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmNews/delete/${payload.newsId}`,
    ...payload
  })
};

/*海报管理-分类列表*/
export const posterCategoryManageList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/posterCategoryManageList`,
    ...payload
  })
};

/*海报管理-海报分类新增/修改*/
export const saveOrUpdatePosterCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/saveOrUpdatePosterCategory`,
    ...payload
  })
};

/*海报管理-海报分类排序*/
export const posterCategoryOrder = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/posterCategoryOrder`,
    ...payload
  })
};

/*海报管理-删除海报分类*/
export const deletePosterCategory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/deletePosterCategory`,
    ...payload
  })
};

/*海报管理-新增海报*/
export const saveOrUpdatePoster = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/saveOrUpdatePoster`,
    ...payload
  })
};

/*海报管理-删除海报*/
export const deletePoster = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/deletePoster`,
    ...payload
  })
};

/*海报管理-海报详情*/
export const posterDetail = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/posterDetail`,
    ...payload
  })
};

/*海报管理-查询海报列表*/
export const posterLists= (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/posterLists`,
    ...payload
  })
};

/*海报管理-批量上下架*/
export const saveByPosterStatus= (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/saveByPosterStatus`,
    ...payload
  })
};

/*海报管理-修改分类*/
export const posterCategoryReplace= (payload) => {
  return createApi({
    url: `${api}/api/channel-service/crmPoster/posterCategoryReplace`,
    ...payload
  })
};