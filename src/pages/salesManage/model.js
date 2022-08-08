import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import { onDownloadFile} from "@/services/salesOrder"
import {
  customerChannelList,
  branchInfo,
  teamInfo,
  saleList,
  saleInfoDetail,
  exportSaleInfo,
  saleBehaviors,
  saleBehaviorsByTimes,
  pointsStatistics,
  pointsBehaviors,
  pointsBehaviorsByBehaviorTime,
  saleCardPackages,
  saleCards,
  crmCustomerTagCountList,
  querySaleInfo,
  addSaleInfo,
  queryEditSaleInfo,
  saveSaleInfo,
  queryCustomerChannelList,
  queryBranchInfo,
  queryTeamInfo,
  addFileTaskInfo,
  querySaleCards,
  querySaleCardPackages,
  crmCustomerListInfo,
  importSaleInfo,
  onImportSaleCheck,
  onUnbindWeWork,
  onSynchronousWeWork,
  queryMoveSaleList
} from "@/services/sales";
const model = {
  namespace: 'salesManageModel',
  //默认数据
  state: {
    channelList: [],//渠道下拉
    storeArr: [],//门店下拉
    teamArr: [],//团队下拉
    saleTotal: 0,//总数
    userInfoLists: [],//销售列表
    saleInfo: {},//销售详情
    zkInfo: {},//掌客信息
    saleDetailInfo: {},//sale详情
    behaviorTotals: 0,//行为记录总数
    behaviors: [],//行为记录数据
    behaviorsTimesArr: [],//行为记录详情
    pointsObj: {},//积分统计
    behaviorPointArr: [],//销售积分数据
    behaviorsPointTimeArr: [],//销售积分详情
    tagCountList: [],//标签列表
    rowsCustomerList: [],//客户信息列表
    rowsCustomerTotal: 0,//客户信息总数
  },

  //处理异步事件
  effects: {
    // 获取所属渠道
    *getCustomerChannelList({ payload, callback }, { call, put }) {
      let response = yield call(customerChannelList, payload);
      yield put({
        type: 'setCustomerChannelList',
        payload: response
      })
    },
    // 获取门店信息
    *getBranchInfo({ payload }, { call, put }) {
      let response = yield call(branchInfo, payload);
      yield put({
        type: 'setBranchInfo',
        payload: response
      })
    },
    // 获取团队信息
    *getTeamInfo({ payload }, { call, put }) {
      let response = yield call(teamInfo, payload);
      yield put({
        type: 'setTeamInfo',
        payload: response
      })
    },
    // 查询销售列表信息
    *getSaleList({ payload, callback }, { call, put }) {
      let response = yield call(saleList, payload);
      yield put({
        type: 'setSaleList',
        payload: response.body
      })
      callback && callback(response)
    },
    // 查询销售详情信息
    *getSaleInfoDetail({ payload }, { call, put }) {
      let response = yield call(saleInfoDetail, payload);
      yield put({
        type: 'setSaleInfoDetail',
        payload: response.body
      })
    },
    // 导出销售列表信息
    *getExportSaleInfo({ payload, callback }, { call, put }) {
      let response = yield call(exportSaleInfo, payload)
      yield put({
        type: 'setExportSaleInfo',
        payload: response
      })
      callback && callback(response)
    },
    // 销售行为记录
    *getSaleBehaviors({ payload, callback }, { call, put }) {
      let response = yield call(saleBehaviors, payload)
      yield put({
        type: 'setSaleBehaviors',
        payload: response.body.data
      })
      callback && callback(response)
    },
    // 销售行为记录-时间
    *getSaleBehaviorsByTimes({ payload, callback }, { call, put }) {
      let response = yield call(saleBehaviorsByTimes, payload)
      yield put({
        type: 'setSaleBehaviorsByTimes',
        payload: response.body
      })
      callback && callback(response)
    },
    // 销售积分统计
    *getPointsStatistics({ payload, callback }, { call, put }) {
      let response = yield call(pointsStatistics, payload)
      yield put({
        type: 'setPointsStatistics',
        payload: response.body
      })
      callback && callback(response)
    },
    // 销售积分明细统计
    *getPointsBehaviors({ payload, callback }, { call, put }) {
      let response = yield call(pointsBehaviors, payload)
      yield put({
        type: 'setPointsBehaviors',
        payload: response.body
      })
      callback && callback(response)
    },
    // 销售积分明细统计-时间
    *getPointsBehaviorsByBehaviorTime({ payload, callback }, { call, put }) {
      let response = yield call(pointsBehaviorsByBehaviorTime, payload)
      yield put({
        type: 'setPointsBehaviorsByBehaviorTime',
        payload: response.body
      })
      callback && callback(response)
    },
    // 销售套餐
    *getSaleCardPackages({ payload }, { call, put }) {
      let response = yield call(saleCardPackages, payload)
      yield put({
        type: 'setSaleCardPackages',
        payload: response
      })
    },
    // 销售卡卷
    *getSaleCards({ payload }, { call, put }) {
      let response = yield call(saleCards, payload)
      yield put({
        type: 'setSaleCards',
        payload: response
      })
    },
    // 客户列表查询标签统计
    *getCrmCustomerTagCountList({ payload, callback }, { call, put }) {
      let response = yield call(crmCustomerTagCountList, payload)
      yield put({
        type: 'setCrmCustomerTagCountList',
        payload: response.body
      })
      callback && callback(response)
    },
    // 销售数据查询(数据迁移)
    *querySaleInfo({ payload, callback }, { call, put }) {
      let response = yield call(querySaleInfo, payload);
      callback && callback(response)
    },
    // 销售数据保存(数据迁移保存)
    *addSaleInfo({ payload, callback }, { call, put }) {
      let response = yield call(addSaleInfo, payload);
      callback && callback(response)
    },
    // 编辑销售客户查询(销售编辑查询)
    *queryEditSaleInfo({ payload, callback }, { call, put }) {
      let response = yield call(queryEditSaleInfo, payload);
      callback && callback(response)
    },
    // 编辑销售保存(销售编辑保存)
    *saveSaleInfo({ payload, callback }, { call, put }) {
      let response = yield call(saveSaleInfo, payload);
      callback && callback(response)
    },
    // 编辑销售获取所属渠道(销售编辑)
    *queryCustomerChannelList({ payload, callback }, { call, put }) {
      let response = yield call(queryCustomerChannelList, payload);
      callback && callback(response)
    },
    // 编辑销售获取门店信息(销售编辑)
    *queryBranchInfo({ payload, callback }, { call, put }) {
      let response = yield call(queryBranchInfo, payload);
      callback && callback(response)
    },
    // 编辑销售获取团队信息(销售编辑)
    *queryTeamInfo({ payload, callback }, { call, put }) {
      let response = yield call(queryTeamInfo, payload);
      callback && callback(response)
    },
    // 导入销售账号  (保存)
    *importSaleInfo({ payload, callback }, { call, put }) {
      let response = yield call(importSaleInfo, payload);
      callback && callback(response)
    },
    // 上传销售客户文件
    *addFileTaskInfo({ payload, callback }, { put, call }) {
      let response = yield call(addFileTaskInfo, payload)
      callback && callback(response)
    },
    // 销售卡卷查询
    *querySaleCards({ payload, callback }, { put, call }) {
      let response = yield call(querySaleCards, payload)
      callback && callback(response)
    },
    // 销售套餐查询
    *querySaleCardPackages({ payload, callback }, { put, call }) {
      let response = yield call(querySaleCardPackages, payload)
      callback && callback(response)
    },
    // 获取客户列表信息
    *getCrmCustomerListInfo({ payload, callback }, { call, put }) {
      let response = yield call(crmCustomerListInfo, payload)
      callback && callback(response)
    },
    // 查询销售下拉搜索信息
    *queryMoveSaleList({ payload, callback }, { put, call }) {
      let response = yield call(queryMoveSaleList, payload)
      callback && callback(response)
    },
    /*下载excel*/
    *onDownloadFile({payload, callback},{put,call}){
      let response = yield call(onDownloadFile, payload)
      callback && callback(response)
    },
    /*导入销售校验*/
    *onImportSaleCheck({payload, callback},{put,call}){
      let response = yield call(onImportSaleCheck, payload)
      callback && callback(response)
    },
    /*同步企微客户*/
    *onSynchronousWeWork({payload, callback},{put,call}){
      let response = yield call(onSynchronousWeWork, payload)
      callback && callback(response)
    },
    /*解绑企微*/
    *onUnbindWeWork({payload, callback},{put,call}){
      let response = yield call(onUnbindWeWork, payload)
      callback && callback(response)
    },


  },





  //处理同步事件
  reducers: {
    //2设置未入账列表
    setCustomerChannelList(state, action) {
      return {
        ...state,
        channelList: action.payload.items.data.channelList
      }
    },
    setBranchInfo(state, action) {
      return {
        ...state,
        storeArr: action.payload.body
      }
    },
    setTeamInfo(state, action) {
      return {
        ...state,
        teamArr: action.payload.body || []
      }
    },
    setSaleList(state, action) {
      return {
        ...state,
        saleTotal: action.payload.total,
        userInfoLists: action.payload.userInfoLists
      }
    },
    setSaleInfoDetail(state, action) {
      return {
        ...state,
        saleInfo: action.payload.saleInfo,
        zkInfo: action.payload.zkInfo,
        saleDetailInfo: action.payload
      }
    },
    // 导出销售列表信息
    setExportSaleInfo(state, action) {
      return { ...state }
    },

    setSaleBehaviors(state, action) {
      // console.log(action, 'action1')
      return {
        ...state,
        behaviors: action.payload.behaviors,
        behaviorTotals: action.payload.behaviorTotals,

      }
    },

    setSaleBehaviorsByTimes(state, action) {
      // console.log(action, 'action2')
      return {
        ...state,
        behaviorsTimesArr: action.payload
      }
    },

    setPointsStatistics(state, action) {
      // console.log(action, 'action3')
      return {
        ...state,
        pointsObj: action.payload
      }
    },

    setPointsBehaviors(state, action) {
      // console.log(action, 'action4')
      return {
        ...state,
        behaviorPointArr: action.payload
      }
    },

    setPointsBehaviorsByBehaviorTime(state, action) {
      // console.log(action, 'action5')
      return {
        ...state,
        behaviorsPointTimeArr: action.payload,
      }
    },

    setSaleCardPackages(state, action) {
      return {
        ...state,
        // saleInfo: action.payload.saleInfo,
        // zkInfo: action.payload.zkInfo
      }
    },
    setSaleCards(state, action) {
      return {
        ...state,
        // saleInfo: action.payload.saleInfo,
        // zkInfo: action.payload.zkInfo
      }
    },
    setCrmCustomerTagCountList(state, action) {
      return {
        ...state,
        tagCountList: action.payload
      }
    },
    setCrmCustomerListInfo(state, action) {
      return {
        ...state,
        rowsCustomerList: action.payload.rows,
        rowsCustomerTotal: action.payload.total,
      }
    },



  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;
