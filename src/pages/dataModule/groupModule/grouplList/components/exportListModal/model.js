import { exportUserGroup, getDownload } from "@/services/groups";
const Model = {
  namespace: 'exportListModal',
  state: {
  },
  effects: {
    //导出
    *exportUserGroup ({ payload, callback }, { put, call }) {
      let response = yield call(exportUserGroup, payload);
      callback && callback(response)
    },
    //下载
    *getDownloadFile({ payload, callback }, { call, put }) {
      let response = yield call(getDownload, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
