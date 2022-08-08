import { activityRule, backStageSActivityTwo, queryGameAnswerConfig, queryGameAnswerData, saveOrUpdateGameAnswerData, copyAnswer, importAnswer } from "@/services/activity";
const Model = {
  namespace: 'answerRules',
  state: {
    subjectList: []
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
    // 获取配置
    *queryGameAnswerConfig ({ payload, callback }, { put, call }) {
      let response = yield call(queryGameAnswerConfig, payload);
      callback && callback(response)
    },
    //查询答题题目
    *queryGameAnswerData ({ payload, callback }, { put, call }) {
      let response = yield call(queryGameAnswerData, payload);
      yield put({
        type: "setSubjectList",
        payload: response
      })
    },
    //保存或修改删除答题题目
    *saveOrUpdateGameAnswerData ({ payload, callback }, { put, call }) {
      let response = yield call(saveOrUpdateGameAnswerData, payload);
      callback && callback(response)
    },
    //复制答题
    *copyAnswer ({ payload, callback }, { put, call }) {
      let response = yield call(copyAnswer, payload);
      callback && callback(response)
    },
    //导入答题题目
    *importAnswer ({ payload, callback }, { put, call }) {
      let response = yield call(importAnswer, payload);
      callback && callback(response)
    },
  },
  reducers: {
    setSubjectList (state, { payload }) {
      if (payload.result.code === '0') {
        state.subjectList = payload.body || [];
        return { ...state };
      } else {
        message.error(payload.result.message)
      }
    },
  },
};
export default Model;
