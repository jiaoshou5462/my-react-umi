import {
  saveUniteStyle
} from "@/services/activity";
const Model = {
  namespace: 'publicPop',
  state: {
  },
  effects: {
    //保存接口
    *saveUniteStyle ({ payload, callback }, { put, call }) {
      let response = yield call(saveUniteStyle, payload);
      callback && callback(response)
    },
  },
  reducers: {
  }
};
export default Model;
