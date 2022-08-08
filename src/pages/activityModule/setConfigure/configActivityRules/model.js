import {activityRule, backStageSActivityTwo, getSubscribelMessage} from "@/services/activity";
const Model = {
  namespace: 'configActivityRules',
  state: {
  },
  effects: {
  *activityRule({ payload,callback }, { put,call }){
      let response = yield call(activityRule,payload);
      callback && callback(response)
    },
    *getActivityRuleDetail({ payload,callback }, { put,call }){
      let response = yield call(backStageSActivityTwo,payload);
      callback && callback(response)
    },
    *getSubscribelMessage({ payload,callback }, { put,call }){
      let response = yield call(getSubscribelMessage,payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
