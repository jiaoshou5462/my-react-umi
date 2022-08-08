import {newStyleSave, getStyleByActivityIdAndStyleCode, getBuyCheaperGoods} from "@/services/activity";
const Model = {
  namespace: 'discountList',
  state: {
    subimtData: '',
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
    setInfoData(state,{payload}){
      state.subimtData = payload
      return {...state};
    },
  },
};
export default Model;
