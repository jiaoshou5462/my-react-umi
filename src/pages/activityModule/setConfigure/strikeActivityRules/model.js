import { activityRule, backStageSActivityTwo, getGameStrikeConfig, updateGameStrikeConfig} from "@/services/activity";
const Model = {
  namespace: 'strikeActivityRules',
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
    // 获取点点乐配置
    *getGameStrikeConfig ({ payload, callback }, { put, call }) {
      let response = yield call(getGameStrikeConfig, payload);
      callback && callback(response)
    },
    //保存或者修改点点乐配置
    *updateGameStrikeConfig ({ payload, callback }, { put, call }) {
      let response = yield call(updateGameStrikeConfig, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
