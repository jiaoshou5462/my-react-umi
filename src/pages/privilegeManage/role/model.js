import { queryRoleList, addRole, putRole, banRole, delRole, getRoleUser, getChannelUser, updateRoleUser, getRoleMenuInfo, updateRoleMenu, getMenuElement, updateMenuElement } from '@/services/privilege';
const Model = {
  namespace: 'roleManage',
  state: {
    roleList: []
  },
  effects: {
    *getQueryRoleList({ payload, callback }, { call, put }) {
      let response = yield call(queryRoleList, payload);
      // yield put({
      //   type: 'setQueryRoleList',
      //   payload:response,
      // });
      callback && callback(response)
    },
    *addRoleData({ payload , callback}, { call,put }) {
      let response = yield call(addRole, payload);
      callback && callback(response)
    },
    *putRoleData({ payload , callback}, { call,put }) {
      let response = yield call(putRole, payload);
      callback && callback(response)
    },
    *banRoleData({ payload , callback}, { call,put }) {
      let response = yield call(banRole, payload);
      callback && callback(response)
    },
    *delRoleData({ payload , callback}, { call,put }) {
      let response = yield call(delRole, payload);
      callback && callback(response)
    },
    *getRoleUserData({ payload , callback}, { call,put }) {
      let response = yield call(getRoleUser, payload);
      callback && callback(response.body)
    },
    *getChannelUserData({ payload , callback}, { call,put }) {
      let response = yield call(getChannelUser, payload);
      callback && callback(response.body)
    },
    *updateRoleUserData({ payload , callback}, { call,put }) {
      let response = yield call(updateRoleUser, payload);
      callback && callback(response.body)
    },
    *getRoleMenuInfoData({ payload , callback}, { call,put }) {
      let response = yield call(getRoleMenuInfo, payload);
      callback && callback(response)
    },
    *updateRoleMenuData({ payload , callback}, { call,put }) {
      let response = yield call(updateRoleMenu, payload);
      callback && callback(response)
    },
    *getMenuElementData({ payload , callback}, { call,put }) {
      let response = yield call(getMenuElement, payload);
      callback && callback(response)
    },
    *updateMenuElementData({ payload , callback}, { call,put }) {
      let response = yield call(updateMenuElement, payload);
      callback && callback(response)
    },
  },
  reducers: {
    setQueryRoleList(state, action) {
      return { ...state, roleList: action.payload.body || {list: []} };
    },
  },
};
export default Model;