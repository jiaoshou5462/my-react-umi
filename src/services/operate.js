import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js';

/*营销项目列表*/
export const marketingProList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/list`,
    ...payload
  })
};

/*添加营销项目接口*/
export const addMarketingProject = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/add`,
    ...payload
  })
};

/*刪除营销项目接口*/
export const delMarketingProject = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/delMarketing`,
    ...payload
  })
};

/*编辑保存项目接口*/
export const updMarketing = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/updMarketing`,
    ...payload
  })
};


// // 发放记录
// export const queryGrantDetail = (payload) => {
//   return createApi({
//     url: `${api}/api/channel-service/grantBatch/queryGrantDetail/${payload.grantBatchId}`,
//     ...payload
//   })
// };

/*添加营销项目接口*/
export const queryBussinessType = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channelMarketingProject/listBusinessType`,
    ...payload
  })
};

