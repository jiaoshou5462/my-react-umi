
import { channelUserpPassword } from "@/services/privilege";
const Model = {
  namespace: 'changePassword',
  state: {
  },
  effects: {
    /*更新密码*/
    *channelUserpPassword ({ payload, callback }, { put, call }) {
      let response = yield call(channelUserpPassword, payload)
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
