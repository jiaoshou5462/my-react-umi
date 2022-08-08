import {
  saveTask,
  queryTaskInfo,
  getWeWorkAuth,
  getCrowdBatchCount
} from '@/services/saleTask';
const Model = {
  namespace: 'saleTaskInfo',
  state: {},
  effects: {
    // 销售任务第一步保存与修改
    *saveTask({ payload, callback }, { call, put }) {
      let response = yield call(saveTask, payload);
      callback && callback(response)
    },
    // 销售任务 查询任务信息
    *queryTaskInfo({ payload, callback }, { call, put }) {
      let response = yield call(queryTaskInfo, payload);
      callback && callback(response)
    },
    //获取客户人群人数
    *getCrowdBatchCount({ payload, callback }, { call, put }) {
      let response = yield call(getCrowdBatchCount, payload);
      callback && callback(response)
    },
    //查询当前渠道是否开通企微
    *getWeWorkAuth({ payload, callback }, { call, put }) {
      let response = yield call(getWeWorkAuth, payload);
      callback && callback(response)
    },

  },
  reducers: {

  },
};
export default Model;
