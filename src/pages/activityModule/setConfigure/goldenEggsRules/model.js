import { activityRule, backStageSActivityTwo } from "@/services/activity";
const Model = {
  namespace: 'goldenEggsRules',
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
  },
  reducers: {
  },
};
export default Model;
