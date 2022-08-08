import { getHistory } from '@/services/tag';
  const Model = {
    namespace: 'setTagHistory',
    state: {
      historyData: {}
    },
    effects: {
      *getHistoryData({ payload, callback}, { call, put }) {
        const response = yield call(getHistory, payload);
        yield put({
          type: 'setHistoryData',
          payload: response,
        });
      },
    },
    reducers: {
      setHistoryData(state, action) {
        return { ...state, historyData: action.payload.body };
      },
    },
  };
  export default Model;
  