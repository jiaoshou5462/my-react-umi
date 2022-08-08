import { completeTaskId, isTaskStatus } from '@/services/saleTask';
const Model = {
  namespace: 'saleFinish',
  state: {
    finishInfo: {}
  },
  effects: {
    // 销售任务 任务回显
    *completeTaskId({ payload, callback }, { call, put }) {
      let response = yield call(completeTaskId, payload);
      yield put({
        type: 'setCompleteTaskId',
        payload:response,
      });
      callback && callback(response)
    },
    // 销售任务立即开始 && 销售任务立即结束 &&  销售任务发布
    *isTaskStatus({ payload, callback }, { call, put }) {
      let response = yield call(isTaskStatus, payload);
      callback && callback(response)
    },
  },
  reducers: {
    setCompleteTaskId(state, action) {
      state.finishInfo = action.payload.body ||{}
      return { ...state}
    },
    onReset(state, action) {
      state.finishInfo = {}
      return { ...state}
    }
  },
};
export default Model;
