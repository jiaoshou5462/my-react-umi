import {queryEnterpriseLogoStatus, backStageSActivityTwo, echoSeckillRuleActivity} from "@/services/activity";
const Model = {
  namespace: 'twoNumber',
  state: {
  },
  effects: {
    *queryEnterpriseLogoStatus({ payload,callback }, { put,call }){
      let response = yield call(queryEnterpriseLogoStatus,payload);
      callback && callback(response)
    },
    //获取活动类型
    *getActivityRuleDetail ({ payload, callback }, { put, call }) {
      let response = yield call(backStageSActivityTwo, payload);
      callback && callback(response)
    },
    //获取活动类型（秒杀 优惠购）
    *echoSeckillRuleActivity ({ payload, callback }, { put, call }) {
      let response = yield call(echoSeckillRuleActivity, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
