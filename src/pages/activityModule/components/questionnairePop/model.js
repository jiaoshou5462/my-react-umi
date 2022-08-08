import { getStyleByActivityIdAndStyleCode, backStageSActivityThree, queryEnterpriseLogo, queryGameAnswerConfig } from "@/services/activity";
const Model = {
  namespace: 'questionnairePop',
  state: {
  },
  effects: {
    //样式回显
    *getStyleByActivityIdAndStyleCode ({ payload, callback }, { put, call }) {
      let response = yield call(getStyleByActivityIdAndStyleCode, payload);
      callback && callback(response)
    },
    //数据回显
    *backStageSActivityThree ({ payload, callback }, { put, call }) {
      let response = yield call(backStageSActivityThree, payload);
      callback && callback(response)
    },
    *queryEnterpriseLogo ({ payload, callback }, { put, call }) {
      let response = yield call(queryEnterpriseLogo, payload);
      callback && callback(response)
    },
    // 查询答题配置
    *queryGameAnswerConfig ({ payload, callback }, { put, call }) {
      let response = yield call(queryGameAnswerConfig, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
