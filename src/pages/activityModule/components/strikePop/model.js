import { getStyleByActivityIdAndStyleCode, backStageSActivityThree } from "@/services/activity";
const Model = {
  namespace: 'strikePop',
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
  },
  reducers: {
  },
};
export default Model;
