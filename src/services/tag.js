
import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

//payload需传入方法以及参数等(url除外)   已修改
export const getMetaInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMeta/`, //新的
    // url: `${api}/api/tag/meta/`,// 老的
    ...payload
  })
};

//获取用户基本信息  已修改
export const getUser = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUser/`,//新的
    // url: `${api}/api/tag/user/`,//老的
    ...payload
  })
};

//查询标签组信息   已修改
export const getGroupAll = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGroup/all`,   // 新的
    // url: `${api}/api/tag/group/all`,  // 老的
    ...payload
  })
};

//根据标签ID获取首页需要标签信息  已修改
export const labelDistribution = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/simple/${payload.id}`,// 新的
    // url: `${api}/api/tag/tag/simple/`+payload.id, // 老的
    ...payload
  })
};

//标签组重命名   已修改
export const groupName = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGroup/name/${payload.name}/${payload.id}`,  // 新的
    // url: `${api}/api/tag/group/name/`+payload.name+'/'+payload.id,// 老的
    ...payload
  })
};

//标签组新增   已修改 
export const addgroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGroup/`,  // 新的
    // url: `${api}/api/tag/group/`,// 老的
    ...payload
  })
};

//标签组删除    已修改 
export const delgroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelGroup/${payload.id}`, // 新的
    // url: `${api}/api/api/tag/group/`+payload.id, // 老的
    ...payload
  })
};

//查询用户群列表   已修改
export const getUserGroup = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelUserGroup/ `, // 新的
    // url: `${api}/api/tag/userGroup/`,// 老的
    ...payload
  })
};


//查询用户群列表--下载
export const getDownload = (payload) => {
  return createApi({
    url: `${api}/api/file/download`,
    responseType: 'blob',
    ...payload
  })
};
//查询标签时间，用户行为满足，下拉列表等数据    已修改
export const getTagEvent = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelEvent/`, // 新的
    // url: `${api}/api/tag/event/`,//老的
    ...payload
  })
};


//导入指定名单新建标签   已修改
export const postTagImport = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/import/`, // 新的
    // url: `${api}/api/tag/tag/import/`, // 老的
    ...payload
  })
};

//新增标签  已修改
export const createTag = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/ `, //新的
    // url: `${api}/api/tag/tag/`, //老的
    ...payload
  })
};

//客户名称
export const getCustomerName = (payload) => {
  return createApi({
    url: `${api}/api/purchase/coupon/getAllChannel`,
    ...payload
  })
};

//根据标签ID获取标签完整数据   已修改
export const getLabelAllInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/${payload.id}`,  // 新的
    // url: `${api}/api/tag/tag/`+payload.id, // 老的
    ...payload
  })
};

//校验标签编码是否唯一   (已弃用)
export const getCodeUnique = (payload) => {
  return createApi({
    url: `${api}/api/tag/tag/unique/tag-code/` + payload.tagCode,
    ...payload
  })
};

//修改创建用户标签   已修改
export const putUserLaber = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/ `, //新的
    // url: `${api}/api/tag/tag/`, // 老的
    ...payload
  })
};

//根据标签ID获取导入标签完整数据   已修改
export const getImportLabelAllInfo = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/import/${payload.id}`, // 新的
    // url: `${api}/api/tag/tag/import/`+payload.id, // 老的
    ...payload
  })
};

//修改导入用户标签  已修改
export const putImportLabel = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/import`, // 新的
    // url: `${api}/api/tag/tag/import`, // 老的
    ...payload
  })
};

//标签手动刷新   已修改
export const putLabelRefresh = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/refresh/${payload.id}`, //新的
    // url: `${api}/api/tag/tag/refresh/`+payload.id,// 老的
    ...payload
  })
};

//标签审核   已修改
export const putLabelAudit = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/audit/${payload.id}/${payload.pass}`, // 新的
    // url: `${api}/api/tag/tag/audit/`+payload.id+`/`+payload.pass, // 老的
    ...payload
  })
};

//标签暂停   已修改
export const putLabelPause = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/stop/${payload.id}`, // 新的
    // url: `${api}/api/tag/tag/stop/`+payload.id, // 老的
    ...payload
  })
};

//标签重启   已修改
export const putLabelReboot = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/reboot/${payload.id}`,
    // url: `${api}/api/tag/tag/reboot/`+payload.id,// 老的
    ...payload
  })
};

//标签历史记录    已修改
export const getHistory = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelHistory/`, // 新的
    // url: `${api}/api/tag/history/`, // 老的
    ...payload
  })
};

//  文件上传
export const uploadImg = `${api}/api/file/upload?folderCode=sale_customer`;


//用户画像  用户数量统计
export const findCustomerDataList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findCustomerDataList`,
    ...payload
  })
};
//用户画像  总统计
export const findUserPortraiListTotalList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findUserPortraiListTotalList`,
    ...payload
  })
};
//用户画像  转化率分析
export const findUserConversionAnalysisList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findUserConversionAnalysisList`,
    ...payload
  })
};
//用户画像  用户活跃度分析
export const findUserActivityAnalysisList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findUserActivityAnalysisList`,
    ...payload
  })
};


// 用户画像 用户来源统计
export const findSourcePersonList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findSourcePersonList`,
    ...payload
  })
};
// 用户画像 性别分布
export const findSexPersonList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findSexPersonList`,
    ...payload
  })
};
// 用户画像 Top10城市
export const findTop10CityList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findTop10CityList`,
    ...payload
  })
};
// 用户画像 用户年龄分析
export const findAgePersonList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findAgePersonList`,
    ...payload
  })
};
// 用户数量统计 Top10省份 条形图
export const findTop10ProvinceList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findTop10ProvinceList`,
    ...payload
  })
};
// 用户画像 卡券偏好
export const findCouponPreferenceList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findCouponPreferenceList`,
    ...payload
  })
};
// 用户画像 用户活跃时间段
export const findUserActivePeriodList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findUserActivePeriodList`,
    ...payload
  })
};
// 用户画像 活动偏好
export const findActivityPreferenceList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/projectUserPortrai/findActivityPreferenceList`,
    ...payload
  })
};

// 激活
export const channelTagActive = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelTag/active/${payload.id}`,
    ...payload
  })
};