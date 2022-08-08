import { saveHomeStyle, saveHomeAdStyle, backStageSActivityThree,queryEnterpriseLogo } from "@/services/activity";
const Model = {
  namespace: 'posterDirectPop',
  state: {
  },
  effects: {
    *queryEnterpriseLogo ({ payload, callback }, { put, call }) {
      let response = yield call(queryEnterpriseLogo, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
