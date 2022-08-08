import { getMetaInfo, getUser, getGroupAll, labelDistribution, groupName,  
  addgroup, delgroup, getUserGroup, getDownload, getTagEvent, postTagImport,
  createTag, getCustomerName, getLabelAllInfo, getCodeUnique, putUserLaber, 
  getImportLabelAllInfo, putImportLabel, putLabelRefresh, putLabelAudit, putLabelPause, putLabelReboot,
  channelTagActive, } from '@/services/tag';
import { message} from 'antd';
import {formatTime} from '@/utils/date.js'
const Model = {
  namespace: 'setTagPanel',
  state: {
    userInfo: {}, //用户基本信息
    isModalVisible: false,//树弹窗
    isCreateModalVisible: false,//创建标签弹窗
    num: 0,//选择自定义创建模式初始化步骤
    switchStatus: true,//默认选中（自动更新)
    isCustomFlag: true,//自定义创建否则导入
    attributeObj: {},//属性初始数据
    tagLayerInfos: [],//层级list
    treeList:[],//所有标签的数据
    labelDefaults: [],//默认选中第一个标签
    labelDistributionList: [], //标签分布人数
    attributeSelectData:{
      oneList:[],twoList:[],threeList:[],
    },//屬性 从后台获取的下拉数据
    actionSelectData:{
      oneList:[],twoList:[],threeList:[],
    },// 行为 从后台获取的下拉数据
    hierarchyIndex:0,//选择当前层
    customerNameList: [],//客户名称
    labelAllInfoData: {}, //查询标签全部数据
    importLabelAllInfoData: {}, //查询导入标签全部数据
    //标签组筛选信息
    tagStatus: [], //标签状态
    createType: [],//创建方式
    refreshType: [],//更新方式
    channelId: [], //客户
    modalType: 'create',//弹窗类型 新增/修改
  },
  effects: {
    *channelTagActive({ payload, callback }, { call,put }) {
      const response = yield call(channelTagActive, payload);
      callback && callback(response)
    },
    *isModalVisible({ payload }, { put }) {
      yield put({
        type: 'setIsModalVisible',
        payload,
      });
    },
    *isCreateModalVisible({ payload }, { put }) {
      yield put({
        type: 'setIsCreateModalVisible',
        payload,
      });
    },
    *num({ payload }, { put }) {
      yield put({
        type: 'setNum',
        payload,
      });
    },
    *tagLayerInfos({ payload }, { put }) {
      yield put({
        type: 'setTagLayerInfos',
        payload,
      });
    },
    
    *switchStatus({ payload }, { put }) {
      yield put({
        type: 'setSwitchStatus',
        payload,
      });
    },
    *isCustomFlag({ payload }, { put }) {
      yield put({
        type: 'setIsCustomFlag',
        payload,
      });
    },
    
    *labelDefaults({ payload }, { put }) {
      yield put({
        type: 'setLabelDefaults',
        payload,
      });
    },
    *getMetaMess({ payload, callback }, { call, put }) {
      const response = yield call(getMetaInfo, payload);
      yield put({
        type: 'setMetaMess',
        payload:response,
      });
    },
    *getTagEvent({ payload, callback }, { call, put }) {
      const response = yield call(getTagEvent, payload);
      yield put({
        type: 'setTagEvent',
        payload:response,
      });
    },
    *getUserInfo({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'setUserInfo',
        payload: response,
      });
    },
    *attributeObj({ payload }, { put }) {
      yield put({
        type: 'setAttributeObj',
        payload,
      });
    },
    *labelAllInfoData({ payload }, { put }) {
      yield put({
        type: 'setLabelAllInfoData',
        payload,
      });
    },
    *importLabelAllInfoData({ payload }, { put }) {
      yield put({
        type: 'setImportLabelAllInfoData',
        payload,
      });
    },
    *getGroupAllData({ payload, callback}, { call, put }) {
      const response = yield call(getGroupAll, payload);
      yield put({
        type: 'setGroupAllData',
        payload: response.body?response.body.nodes:[],
      });
    },
    *labelDistributionData({ payload}, { call, put }) {
      const response = yield call(labelDistribution, payload);
      yield put({
        type: 'setLabelDistribution',
        payload: response,
      });
    },
    *putGroupName({ payload, callback}, { call, put }) {
      const response = yield call(groupName, payload)
      callback && callback(response)
    },
    *addGroup({ payload, callback}, { call, put }) {
      const response = yield call(addgroup, payload)
      callback && callback(response)
    },
    *delGroup({ payload, callback}, { call, put }) {
      const response = yield call(delgroup, payload)
      callback && callback(response)
    },
    *getDownloadFile({ payload, callback }, { call, put }) {
      const response = yield call(getDownload, payload);
      callback && callback(response)
    },
    *postTagImportData({ payload, callback }, { call, put }) {
      const response = yield call(postTagImport, payload);
      callback && callback(response)
    },
    *createTag({ payload, callback }, { call, put }) {
      const response = yield call(createTag, payload);
      callback && callback(response)
    },
    *getCustomerNameData({ payload, callback}, { call, put }) {
      const response = yield call(getCustomerName, payload);
      yield put({
        type: 'setCustomerNameData',
        payload: response.body,
      });
      callback && callback(response)
    },
    *getLabelAllInfoData({ payload}, { call, put }) {
      const response = yield call(getLabelAllInfo, payload);
      yield put({
        type: 'setLabelAllInfoData',
        payload: response.body,
      });
    },
    *getCodeUniqueData({ payload, callback}, { call, put }) {
      const response = yield call(getCodeUnique, payload);
      callback && callback(response)
    },
    *putUserLaberData({ payload, callback}, { call, put }) {
      const response = yield call(putUserLaber, payload);
      callback && callback(response)
    },
    *putImportLabelData({ payload, callback}, { call, put }) {
      const response = yield call(putImportLabel, payload);
      callback && callback(response)
    },
    
    *getImportLabelAllInfoData({ payload, callback}, { call, put }) {
      const response = yield call(getImportLabelAllInfo, payload);
      yield put({
        type: 'setImportLabelAllInfoData',
        payload: response.body,
      });
    },

    *putLabelRefreshData({ payload, callback}, { call, put }) {
      const response = yield call(putLabelRefresh, payload);
      callback && callback(response);
    },
    *putLabelAuditData({ payload, callback}, { call, put }) {
      const response = yield call(putLabelAudit, payload);
      callback && callback(response)
    },
    *putLabelPauseData({ payload, callback}, { call, put }) {
      const response = yield call(putLabelPause, payload);
      callback && callback(response)
    },
    *putLabelRebootData({ payload, callback}, { call, put }) {
      const response = yield call(putLabelReboot, payload);
      callback && callback(response)
    },
    *clearDataAction({ payload, callback}, { call, put }) {
      yield put({
        type: 'dataModule_userAction/setParentsData',
        payload: {},
      });
      yield put({
        type: 'dataModule_userAttribute/setParentsData',
        payload: {},
      });
      yield put({
        type: 'clearData',
        payload: '',
      });
    },
  },
  reducers: {
    setIsModalVisible(state, action) {
      return { ...state, isModalVisible: action.payload };
    },
    setIsCreateModalVisible(state, action) {
      return { ...state, isCreateModalVisible: action.payload };
    },
    setNum(state, action) {
      return { ...state, num: action.payload };
    },
    setSwitchStatus(state, action) {
      return { ...state, switchStatus: action.payload };
    },
    setIsCustomFlag(state, action) {
      return { ...state, isCustomFlag: action.payload };
    },
    setUserInfo(state, action) {
      return { ...state, userInfo: action.payload.body };
    },
    setAttributeObj(state, action) {
      return { ...state, attributeObj: action.payload };
    },
    setTagLayerInfos(state, action) {
      return { ...state, tagLayerInfos: action.payload };
    },
    setLabelAllInfoData(state, action) {
      return { ...state, labelAllInfoData: action.payload };
    },
    setImportLabelAllInfoData(state, action) {
      return { ...state, importLabelAllInfoData: action.payload };
    },
    setLabelDefaults(state, action) {
      return { ...state, labelDefaults: action.payload };
    },
    
    setMetaMess(state,action){
      let res = action.payload;
      let selectData={};
      if (res.body && res.body.length > 0) {
        selectData.oneList = res.body;
        selectData.twoList = res.body[0].dataTypeInfo.predicateInfoList;
        selectData.threeList = res.body[0].userMetaInfoOptions;
      }
      return { ...state, attributeSelectData: selectData };
    },
    setTagEvent(state,action){
      let res = action.payload;
      let selectData={};
      if (res.body && res.body.length > 0) {
        selectData.oneList = res.body;
        selectData.twoList = res.body[0].userEventPropertiesInfos;
        selectData.threeList = res.body[0].userEventPropertiesInfos[0].dataTypeInfo.predicateInfoList;
      }
      return { ...state, actionSelectData: selectData };
    },
    // 构建左侧树形结构数据
    setGroupAllData(state, action) {
      let treeList = []
      let labelDefaults = [] //默认选中第一个标签
      if(action.payload) {
        action.payload.forEach((item, rank1Index) => {
          let children = []
          if(item.nodes) {
            item.nodes.forEach((itemSon,rank2Index) => {
              let grandson = []
              if(itemSon.tags) {
                itemSon.tags.forEach((itemGrandson,rank3Index) => {
                  //默认选中第一个标签
                  if(rank1Index===0 && rank2Index===0 && rank3Index===0) {
                    labelDefaults[0] = 'tagId,'+itemGrandson.id
                  }
                  grandson.push({title: itemGrandson.tagName,  key: 'tagId,'+itemGrandson.id,isLeaf: true, rank:3})
                })
              }
              children.push({title: itemSon.tagGroupName,  key: 'tagGroupId,'+itemSon.id, children: grandson, rank:2})
            })
          }
          treeList.push({title: item.tagGroupName, key: 'tagGroupId,'+item.id, children: children, rank:1})
        })
      }
      return { ...state, treeList: treeList, labelDefaults: labelDefaults };
    },
    setLabelDistribution(state, action) {
      return { ...state, labelDistributionList: action.payload.body };
    },
    //设置选中当前层
    setHierarchyIndex(state, action){
      return { ...state, hierarchyIndex: action.payload };
    },
    // 客户渠道
    setCustomerNameData(state, action){
      return { ...state, customerNameList: action.payload };
    },
    setLabelAllInfoData(state, action){
      let newTagLayerInfos = []
      if(action.payload.tagLayerInfos) {
        action.payload.tagLayerInfos.forEach(item => {
          newTagLayerInfos.push({
            id: item.id,
            layerName: item.layerName,
            remark: item.remark,
            propertiesEventRelation: item.propertiesEventRelation,//属性/行为 关系 总关系
            eventRelation: item.eventRelation,//行为关系
            propertiesRelation: item.propertiesRelation,//属性关系
            propertiesDefinitionGroups: item.propertiesDefinitionGroups,//属性数组
            eventDefinitionGroups: item.eventDefinitionGroups,//行为数组
          })
        })
      }
      return { ...state, labelAllInfoData: action.payload, tagLayerInfos: newTagLayerInfos};
    },
    setImportLabelAllInfoData(state, action){
      return { ...state, importLabelAllInfoData: action.payload };
    },
    setModalType(state, action){
      return { ...state, modalType: action.payload };
    },
    clearData(state, action){
      return { 
        ...state,
        labelAllInfoData: {},
        tagLayerInfos:[],
        num:0,
        importLabelAllInfoData:{},
        hierarchyIndex:0,
      };
    },
  },
};
export default Model;
