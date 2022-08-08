import { newStyleSave, getStyleByActivityIdAndStyleCode, queryGameAnswerData} from "@/services/activity";
const Model = {
  namespace: 'answerGame',
  state: {
  },
  effects: {
    //样式保存
    *newStyleSave ({ payload, callback }, { put, call }) {
      let response = yield call(newStyleSave, payload);
      callback && callback(response)
    },
    //样式回显
    *getStyleByActivityIdAndStyleCode ({ payload, callback }, { put, call }) {
      let response = yield call(getStyleByActivityIdAndStyleCode, payload);
      callback && callback(response)
    },
    //查询答题题目
    *queryGameAnswerData({ payload, callback }, { put, call }) {
      let response = yield call(queryGameAnswerData, payload);
      callback && callback(response)
    },
  },
  reducers: {

  },
};
export default Model;
