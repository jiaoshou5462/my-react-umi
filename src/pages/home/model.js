
const Model = {
  namespace: 'setNumber',
  state: {
    number: 0,
    comp1Num: 0,
  },
  effects: {
    *addNumber({ payload }, { put }) {
      yield put({
        type: 'setaddNumber',
        payload,
      });
    },
    *toComp1({ payload }, { put }) {
      yield put({
        type: 'settoComp1',
        payload,
      });
    },
  },
  reducers: {
    setaddNumber(state, action) {
      return { ...state, number: action.payload || {} };
    },
    settoComp1(state, action) {
      return { ...state, comp1Num: action.payload || {} };
    },
  },
};
export default Model;
