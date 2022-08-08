import { queryUserList, addUser, banUser, updateUser, queryUserRole, queryRoleInfo, updateUserRole,passwordReset } from '@/services/privilege';
const Model = {
  namespace: 'accountManage',
  state: {
    accountList: []
  },
  effects: {
    *getQueryUserList({ payload, callback }, { call, put }) {
      const response = yield call(queryUserList, payload);
      // yield put({
      //   type: 'setQueryUserList',
      //   payload:response,
      // });
      callback && callback(response)
    },
    *addUserData({ payload , callback}, { call,put }) {
      let response = yield call(addUser, payload);
      callback && callback(response)
    },
    *banUserData({ payload , callback}, { call,put }) {
      let response = yield call(banUser, payload);
      callback && callback(response)
    },
    *updateUserData({ payload , callback}, { call,put }) {
      let response = yield call(updateUser, payload);
      callback && callback(response)
    },
    *queryUserRoleData({ payload , callback}, { call,put }) {
      let response = yield call(queryUserRole, payload);
      callback && callback(response.body)
    },
    *queryRoleInfoData({ payload , callback}, { call,put }) {
      let response = yield call(queryRoleInfo, payload);
      callback && callback(response.body)
    },
    *updateUserRoleData({ payload , callback}, { call,put }) {
      let response = yield call(updateUserRole, payload);
      callback && callback(response.body)
    },
    *passwordReset({ payload , callback}, { call,put }) {
      let response = yield call(passwordReset, payload);
      callback && callback(response)
    },
  },
  reducers: {
    setQueryUserList(state, action) {
      return { ...state, accountList: action.payload.body || {list: []} };
    },
  },
};
export default Model;