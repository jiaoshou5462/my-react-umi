import {
  addTeam,
  getTeamList,
  getStoreList,
  onDeleteTeam,
  getEditDetail,
  onCheckAddTeam,
  getTeamUserList,
  onExportTeamList,
} from '@/services/team'
import {
  crmCustomerTagCountList
} from "@/services/sales";
import {message} from "antd";
const model = {
  namespace: 'teamManageList',
  //默认数据
  state: {
    list: [], //列表
    pageTotal: 1, //列表总数据
    storeList: [], //门店列表
    teamUserList: [], //团队长信息
    tagCountList: [], //标签列表
    editDetail: {}, //编辑团队详请
  },
  //处理异步事件
  effects: {
    /*获取 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getTeamList, payload)
      if(response.result.code = '0') {
        yield put({
          type: "setList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 门店*/
    *getStoreList({payload, callback},{put,call}){
      let response = yield call(getStoreList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setStoreList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 团队长信息列表*/
    *getTeamUserList({payload, callback},{put,call}){
      let response = yield call(getTeamUserList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setTeamUserList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    // 标签列表
    *getCrmCustomerTagCountList({ payload, callback }, { call, put }) {
      let response = yield call(crmCustomerTagCountList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setCrmCustomerTagCountList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    // 编辑团队详请
    *getEditDetail({ payload, callback }, { call, put }) {
      let response = yield call(getEditDetail, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setEditDetail",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*新增/编辑 团队信息*/
    *addTeam({payload, callback},{put,call}){
      let response = yield call(addTeam, payload)
      callback && callback(response)
    },
    /*校验 新增/编辑 团队信息*/
    *onCheckAddTeam({payload, callback},{put,call}){
      let response = yield call(onCheckAddTeam, payload)
      callback && callback(response)
    },
    /*删除团队信息*/
    *onDeleteTeam({payload, callback},{put,call}){
      let response = yield call(onDeleteTeam, payload)
      callback && callback(response)
    },
    /*导出列表*/
    *onExportTeamList({payload, callback},{put,call}){
      let response = yield call(onExportTeamList, payload)
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    setList(state, {payload}) {
      let temp = payload.body || {}
      state.list = temp.data || []
      state.pageTotal = temp.pageInfo.totalCount || 1
      return {...state};
    },
    setStoreList(state, {payload}) {
      state.storeList = payload.body || []
      return {...state};
    },
    setTeamUserList(state, {payload}) {
      state.teamUserList = payload.body || []
      return {...state};
    },
    setEditDetail(state, {payload}) {
      state.editDetail = payload.body || {}
      return {...state};
    },
    setCrmCustomerTagCountList(state, {payload}) {
      let temp = payload.body || []
      temp.map((item, key) => {
        item.key = key
        item.status = false
      })
      state.tagCountList = temp
      return {...state};
    },
    onReset(state) {
      state.editDetail = {}
      state.teamUserList = []
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
