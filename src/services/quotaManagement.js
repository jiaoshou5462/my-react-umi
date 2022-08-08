import {api} from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/* 额度管理 */
// 查询环形图数据
export const quotaManageQueryRing = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/quotaManage/queryRing`,
    ...payload
  })
};