import { channelGroupChannel, channelPredicateTag} from '@/services/groups';
const Model = {
  namespace: 'tagAttribute',
  state: {
    parentsData:{},
    selectData:{
      oneList:[],
      threeList:[],
    },
    twoListData:[],
  },
  effects: {
    *channelGroupChannel({ payload, callback }, { call, put }) {
      const response = yield call(channelGroupChannel, payload);
      yield put({
        type: 'setTagList',
        payload:response,
      });
    },
    *channelPredicateTag({ payload, callback }, { call, put }) {
      const response = yield call(channelPredicateTag, payload);
      yield put({
        type: 'setTwoListData',
        payload:response,
      });
    },
  },
  reducers: {
    setTagList(state,action){
      let res = action.payload;
      let selectData={};
      if (res.body && res.body.length > 0) {
        for(let item of res.body){
          item.tagName = item.tagGroupName;
        }
        selectData.oneList = res.body;
        selectData.threeList = [];
      }
      return { ...state, selectData: selectData };
    },
    setTwoListData(state,action){
      let res = action.payload;
      let twoListData = res.body || [{}];
      return { ...state, twoListData: twoListData };
    },
    setParentsData(state, action) {
      return { ...state, parentsData: action.payload,};
    },
    
  },
};
export default Model;
