import { activityRule, backStageSActivityTwo, getGameStrikeConfig } from "@/services/activity";
const Model = {
  namespace: 'flipCardRules',
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
    *getGameStrikeConfig ({ payload, callback }, { put, call }) {
      let response = yield call(getGameStrikeConfig, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
