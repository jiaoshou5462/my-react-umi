
const Model = {
  namespace: 'dataModule_userAction',
  state: {
    parentsData:{},
  },
  effects: {
    // *isModalVisible({ payload }, { put }) {
    //   yield put({
    //     type: 'setIsModalVisible',
    //     payload,
    //   });
    // },
    
  },
  reducers: {
    setParentsData(state, action) {
      return { ...state, parentsData: action.payload };
    },
    
  },
};
export default Model;
