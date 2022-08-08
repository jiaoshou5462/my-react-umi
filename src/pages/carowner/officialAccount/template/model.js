import {queryTemplateWechart,syncTemplateFromRemoteService} from '@/services/officialAccount';
const Model = {
  namespace: 'templateMessageNew',
  state: {
  },
  effects: {
     /* 微信模板 */
    *queryTemplateWechart({ payload, callback }, { put, call }) {
      let response = yield call(queryTemplateWechart, payload)
      callback && callback(response)
    },
    /* 同步 */
    *syncTemplateFromRemoteService({ payload, callback }, { put, call }) {
      let response = yield call(syncTemplateFromRemoteService, payload)
      callback && callback(response)
    },
   
  },
  reducers: {
   
  },
};
export default Model;