import {
  getTaskRankList,
  getTaskTeamList,
  getTaskBranchList,
  getTaskFinishTrend,
  onDownloadTaskRank,
  getTaskFinishDegree,
} from '@/services/saleTask'
import {message} from "antd";
const model = {
  namespace: 'taskDataView',
  //默认数据
  state: {
    list: [], //排名列表
    pageTotal: 1, //列表总数据
    teamList: [], //团队
    branchList: [], //门店
    finishTrend: [], //折线图
    finishDegree: [], //完成度
  },
  //处理异步事件
  effects: {
    /*获取 任务门店-团队-个人排行 列表*/
    *getList({payload, callback},{put,call}){
      let response = yield call(getTaskRankList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 任务相关门店列表*/
    *getTaskBranchList({payload, callback},{put,call}){
      let response = yield call(getTaskBranchList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setTaskBranchList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 任务相关团队列表列表*/
    *getTaskTeamList({payload, callback},{put,call}){
      let response = yield call(getTaskTeamList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setTaskTeamList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 当前任务完成度*/
    *getTaskFinishDegree({payload, callback},{put,call}){
      let response = yield call(getTaskFinishDegree, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setTaskFinishDegree",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 查询任务完成度趋势-折线图*/
    *getTaskFinishTrend({payload, callback},{put,call}){
      let response = yield call(getTaskFinishTrend, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setTaskFinishTrend",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取 下载当前任务门店-团队-个人排行 文件code*/
    *onDownloadTaskRank({payload, callback},{put,call}){
      let response = yield call(onDownloadTaskRank, payload)
      if(response.result.code === '0') {
        callback && callback(response)
      }else {
        message.error(response.result.message)
      }
    },
  },
  //处理同步事件
  reducers: {
    setList(state,{payload}){
      let temp = payload.body
      state.list = temp.taskRanks || []
      state.pageTotal = temp.pageInfoVO.totalCount || 1
      return {...state};
    },
    setTaskBranchList(state,{payload}){
      state.branchList = payload.body || []
      return {...state};
    },
    setTaskTeamList(state,{payload}){
      state.teamList = payload.body || []
      return {...state};
    },
    setTaskFinishDegree(state,{payload}){
      state.finishDegree = payload.body || []
      return {...state};
    },
    setTaskFinishTrend(state,{payload}){
      state.finishTrend = payload.body || []
      return {...state};
    },
    onReset(state, {payload}){
      state.teamList = []
      return {...state}
    }
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
