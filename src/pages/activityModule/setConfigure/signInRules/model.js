import { activityRule, backStageSActivityTwo, getActivityRule, saveOrUpdateActivityRule, checkActivityRule } from "@/services/activity";
const Model = {
  namespace: 'signInRules',
  state: {
  },
  effects: {
    *activityRule ({ payload, callback }, { put, call }) {
      let response = yield call(activityRule, payload);
      callback && callback(response)
    },
    *getActivityRuleDetail ({ payload, callback }, { put, call }) {
      let response = yield call(backStageSActivityTwo, payload);
      callback && callback(response)
    },
    *getActivityRule ({ payload, callback }, { put, call }) {
      let response = yield call(getActivityRule, payload);
      callback && callback(response)
    },
    *saveOrUpdateActivityRule ({ payload, callback }, { put, call }) {
      let response = yield call(saveOrUpdateActivityRule, payload);
      callback && callback(response)
    },
    *checkActivityRule ({ payload, callback }, { put, call }) {
      let response = yield call(checkActivityRule, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
