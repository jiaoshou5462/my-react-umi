import { newStyleSave, getStyleByActivityIdAndStyleCode } from "@/services/activity";
const Model = {
  namespace: 'flipCardGame',
  state: {
    subimtData: '',
    adverData: ''
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
  },
  reducers: {
    setInfoData (state, { payload }) {
      state.subimtData = payload
      return { ...state };
    },
    setSaveData (state, { payload }) {
      state.adverData = payload
      return { ...state };
    }
  },
};
export default Model;
