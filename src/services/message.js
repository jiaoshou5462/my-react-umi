import { api } from './env-config.js'; //环境变量
import { createApi } from '@/utils/axios.js'; //环境变量

/*渠道消息通知分页列表*/
export const getMessageManagerList = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/message/selectPage`,
    ...payload
  })
};

// 更新渠道消息通知读取状态
export const getReadMessage = (payload) => {
  return createApi({
    url: `${api}/api/channel-service/channel/message/readMessage`,
    ...payload
  })
};

