
import {
  listMarketProject,
  saveWanderInfo,
  getSceneTemplateList,
  getAppSettingListByChannelId,
  findSceneTypeVariableList,
  listWanderGrantBatch,
  listWanderGrantBatchDetail,
  saveTemplate,
  getEditSceneTemplate,
  queryWanderStrategyById, // 编辑回显
  getSceneDetail,
  queryCrowdByStrategyId,
  getMarketingSceneTemplate,
  queryTriggerSence,
  queryActivityList,
  queryPrize,
  queryPageBrowing
} from "@/services/strategicManage"
import {message} from "antd";
const model = {
  namespace: 'createStrategic',
  //默认数据
  state: {
    firstStepData:{},
    echoFirstStepData:null,
    secondStepData:{
      wanderStrategyTaskVOList:null,
      wanderStrategyCrowdVOList:null,
      userSelectedRows:null,
      configData:null
    },
    echoSecondStepData:null,
    currentStep:0,
    toSecondStep:null,
    tofirstStep:null,
    queryId:null,
    editconfigIdCodeData:null
  },
  //处理异步事件
  effects: {
    /*获取卡券弹窗列表*/
    *listWanderGrantBatch({payload, callback},{put,call}){
      let response = yield call(listWanderGrantBatch, payload)
      callback && callback(response)
    },
    /*获取卡券弹窗子列表*/
    *listWanderGrantBatchDetail({payload, callback},{put,call}){
      let response = yield call(listWanderGrantBatchDetail, payload)
      callback && callback(response)
    },
    /*查询营销项目*/
    *listMarketProject({payload, callback},{put,call}){
      let response = yield call(listMarketProject, payload)
      callback && callback(response)
    },
    /*保存营销项目*/
    *saveWanderInfo({payload, callback},{put,call}){
      let response = yield call(saveWanderInfo, payload)
      callback && callback(response)
    },
    /*查询场景模板*/
    *getSceneTemplateList({payload, callback},{put,call}){
      let response = yield call(getSceneTemplateList, payload)
      callback && callback(response)
    },
    *getAppSettingListByChannelId({payload, callback},{put,call}){
      let response = yield call(getAppSettingListByChannelId, payload)
      callback && callback(response)
    },
    *findSceneTypeVariableList({payload, callback},{put,call}){
      let response = yield call(findSceneTypeVariableList, payload)
      callback && callback(response)
    },
    /* 获取编辑数据 */
    *queryWanderStrategyById({payload, callback},{put,call}){
      let response = yield call(queryWanderStrategyById, payload)
      callback && callback(response)
    },
    /* 保存模板 */
    *saveTemplate({payload, callback},{put,call}){
      let response = yield call(saveTemplate, payload)
      callback && callback(response)
    },
    /* 获取模板详情 */
    *getSceneTemplateDetail({payload, callback},{put,call}){
      let response = yield call(getSceneTemplateDetail, payload)
      callback && callback(response)
    },
    /* 编辑页面模板详情接口 */
    *getSceneDetail({ payload, callback }, { call, put }) {
      let response = yield call(getSceneDetail, payload)
      callback && callback(response)
    },
    *getSceneTemplateListDetail({ payload, callback }, { call, put }) {
      let response = yield call(getEditSceneTemplate, payload)
      callback && callback(response)
    },
    *queryCrowdByStrategyId({ payload, callback }, { call, put }) {
      let response = yield call(queryCrowdByStrategyId, payload)
      callback && callback(response)
    },
    *getMarketingSceneTemplate({ payload, callback }, { call, put }) {
      let response = yield call(getMarketingSceneTemplate, payload)
      callback && callback(response)
    },
    /* 获取触发条件 */
    *queryTriggerSence({ payload, callback }, { call, put }) {
      let response = yield call(queryTriggerSence, payload)
      callback && callback(response)
    },
    /* 获取活动下拉数据 */
    *queryActivityList({ payload, callback }, { call, put }) {
      let response = yield call(queryActivityList, payload)
      callback && callback(response)
    },
    /* 获取中奖奖品类型 */
    *queryPrize({ payload, callback }, { call, put }) {
      let response = yield call(queryPrize, payload)
      callback && callback(response)
    },
    *queryPageBrowing({ payload, callback }, { call, put }) {
      let response = yield call(queryPageBrowing, payload)
      callback && callback(response)
    }
},
  //处理同步事件
  reducers: {
    /* 存储第一步数据 */
    setFirstStepData(state,{payload}){  
      state.firstStepData = payload.firstStepData
      state.firstStepData.id = payload.id
      state.queryId = payload.id
      return {...state};
    },
    /* 存储第一步数据 */
    setFirstEchoStepData(state,{payload}){  
      state.echoFirstStepData = payload.echoFirstStepData
      return {...state};
    },
    // 编辑数据存储第二步
    setEditSecondStepData(state,{payload}){  
      state.secondStepData = payload.secondStepData
      return {...state};
    },
    // 编辑数据存储第二步必填
    setEditEchoSecondStepData(state,{payload}){  
      state.echoSecondStepData = payload.echoSecondStepData
      return {...state};
    },
    // 第二步选择触发场景，触发节点在暂存
    setEditconfigIdCodeData(state,{payload}){
      state.editconfigIdCodeData = JSON.stringify(payload.editconfigIdCodeData)!='{}'?payload.editconfigIdCodeData:null
      return {...state}
    },
    /* 第一步是否填写完整进入第二步*/
    isToSecondStep(state,{payload}){
      state.toSecondStep = payload
      return {...state};
    },
     /* 点击上方圆点进入上一步*/
     isToFirstStep(state,{payload}){
      state.toFirstStep = payload
      return {...state};
    },
    /* 更改step */
    setCurrentStep(state,{payload}){  
      state.currentStep = payload
      state.toSecondStep =  null
      state.toFirstStep =  null
      return {...state};
    },
    /* 清除缓存数据*/
    setReset(state,{payload}){
      state = {
        firstStepData:{},
        echoFirstStepData:null,
        secondStepData:{
          wanderStrategyTaskVOList:null,
          wanderStrategyCrowdVOList:null,
          userSelectedRows:null
        },
        echoSecondStepData:null,
        currentStep:0,
        toSecondStep:null,
        tofirstStep:null,
        queryId:null,
        editconfigIdCodeData:null
      }
      return JSON.parse(JSON.stringify(state));
    }
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
