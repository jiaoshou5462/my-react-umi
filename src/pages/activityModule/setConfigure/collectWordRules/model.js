import { activityRule, backStageSActivityTwo, getGameStrikeConfig, queryGameWordConfig, uploadIconWord} from "@/services/activity";
const Model = {
  namespace: 'collectWordRules',
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
    //查询集字配置
    *queryGameWordConfig ({ payload, callback }, { put, call }) {
      let response = yield call(queryGameWordConfig, payload);
      callback && callback(response)
    },
    *uploadIconWord ({ payload, callback }, { put, call }) {
      let response = yield call(uploadIconWord, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
