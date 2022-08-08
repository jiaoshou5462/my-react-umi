import { getMetaInfo, getTagEvent, getUserGroup, getDownload, postTagImport, putRefresh, getCustomerName, 
   getAllImportUserGroup, getAllUserGroup, putAllImportUserGroup, putAllUserGroup, getCodeSole, getNameSole,
  channelUserGroupTask,userGroupStop,userGroupGetTagSceneById,channelUserGroupTag} from '@/services/groups';
import {formatTime} from '@/utils/date.js'
import { message} from 'antd';
const Model = {
  namespace: 'setGroupList',
  state: {
    userInfo: {}, //用户基本信息
    isModalVisible: false,//树弹窗
    isCreateModalVisible: false,//创建标签弹窗
    num: 0,//选择自定义创建模式初始化步骤
    switchStatus: true,//默认选中（自动更新)
    isCustomFlag: '',//自定义创建否则导入
    attributeObj: {},//属性初始数据
    tagLayerInfos: [],//层级list
    treeList:[],//所有标签的数据
    labelDefaults: [],//默认选中第一个标签
    labelDistributionList: [], //标签分布人数
    userGroupList: [], //用户群列表
    attributeSelectData:{
      oneList:[],twoList:[],threeList:[],
    },//屬性 从后台获取的下拉数据
    actionSelectData:{
      oneList:[],twoList:[],threeList:[],
    },// 行为 从后台获取的下拉数据
    hierarchyIndex:0,//选择当前层
    customerNameList: [], //客户名称列表
    allImportUserGroupData: {}, //导入获取修改用户群数据
    allUserGroupData: {},  //创建获取修改用户群数据
    modalType: 'create',//弹窗类型 新增/修改
    listDetailShow:false,//群组详情
    callSceneShow:false,//调用场景
    complateData:{},//第四步数据
  },
  effects: {
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
    *attributeObj({ payload }, { put }) {
      yield put({
        type: 'setAttributeObj',
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
    *getUserGroupData({ payload,callback }, { call, put }) {
      const response = yield call(getUserGroup, payload);
      yield put({
        type: 'setUserGroupList',
        payload: response.body,
      });
      callback && callback();
    },
    *getDownloadFile({ payload, callback }, { call, put }) {
      const response = yield call(getDownload, payload);
      callback && callback(response)
    },
    *postTagImportData({ payload, callback }, { call, put }) {
      const response = yield call(postTagImport, payload);
      callback && callback(response)
    },
    
    *putRefreshData({ payload, callback }, { call, put }) {
      const response = yield call(putRefresh, payload);
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
    *getAllImportUserGroupData({ payload, callback }, { call, put }) {
      const response = yield call(getAllImportUserGroup, payload);
      yield put({
        type: 'setAllImportUserGroupData',
        payload: response.body,
      });
    },
    *getAllUserGroupData({ payload, callback }, { call, put }) {
      const response = yield call(getAllUserGroup, payload);
      yield put({
        type: 'setAllUserGroupData',
        payload: response.body,
      });
    },
    *putAllImportUserGroupData({ payload, callback }, { call, put }) {
      const response = yield call(putAllImportUserGroup, payload);
      callback && callback(response)
    },
    *putAllUserGroupData({ payload, callback }, { call, put }) {
      const response = yield call(putAllUserGroup, payload);
      callback && callback(response)
    },
    *channelUserGroupTag({ payload, callback }, { call, put }) {
      const response = yield call(channelUserGroupTag, payload);
      callback && callback(response)
    },
    *getCodeUniqueData({ payload, callback}, { call, put }) {
      const response = yield call(getCodeSole, payload);
      callback && callback(response)
    },
    *getNameUniqueData({ payload, callback}, { call, put }) {
      const response = yield call(getNameSole, payload);
      callback && callback(response)
    },
    *getDetailList({ payload, callback}, { call, put }) {
      const response = yield call(channelUserGroupTask, payload);
      callback && callback(response.body)
    },
    //启用禁用
    *userGroupStop({ payload, callback}, { call, put }) {
      const response = yield call(userGroupStop, payload);
      callback && callback(response.body)
    },
    //调用场景
    *userGroupGetTagSceneById({ payload, callback}, { call, put }) {
      const response = yield call(userGroupGetTagSceneById, payload);
      callback && callback(response.body)
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
        type: 'tagAttribute/setParentsData',
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
      return { ...state, userInfo: action.payload };
    },
    setAttributeObj(state, action) {
      return { ...state, attributeObj: action.payload };
    },
    setTagLayerInfos(state, action) {
      return { ...state, tagLayerInfos: action.payload };
    },
    clearAllUserGroupData(state, action) {
      return { ...state, allUserGroupData: action.payload };
    },
    setAllImportUserGroupData(state, action) {
      return { ...state, allImportUserGroupData: action.payload };
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
    setGroupAllData(state, action) {
      let treeList = []
      let labelDefaults = [] //默认选中第一个标签
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
      return { ...state, treeList: treeList, labelDefaults: labelDefaults };
    },
    setLabelDistribution(state, action) {
      return { ...state, labelDistributionList: action.payload };
    },
    setUserGroupList(state, action) {
      let userGroupList = []
      if(action.payload.list) {
        action.payload.list.forEach(item => {
          item.createTime = item.createTime ? item.createTime :'*'
          item.updateTime = item.updateTime ? item.updateTime :'*'
          item.createTypeName = item.createType==='CUSTOMIZE'?'自定义':item.createType==='IMPORT'?'导入名单':'标签人群';
          item.refreshType = item.refreshType ==='MANUAL'?'手动更新':item.refreshType==='AUTO'?'自动更新':'导入'
          item.countNum = item.countNum ? item.countNum:item.countNum=0
          userGroupList.push(item)
        })
      }
      return { ...state, userGroupList: action.payload };
    },
    //设置选中当前层
    setHierarchyIndex(state, action){
      return { ...state, hierarchyIndex: action.payload };
    },
    setCustomerNameData(state, action){
      return { ...state, customerNameList: action.payload };
    },
    setAllUserGroupData(state, action){
      let newTagLayerInfos = [{}]
      if(action.payload) {
        newTagLayerInfos[0].propertiesEventRelation = action.payload.propertiesEventRelation;
        newTagLayerInfos[0].eventRelation = action.payload.eventRelation;
        newTagLayerInfos[0].propertiesRelation = action.payload.propertiesRelation;
        newTagLayerInfos[0].propertiesDefinitionGroups = action.payload.propertiesDefinitionGroups;
        newTagLayerInfos[0].eventDefinitionGroups = action.payload.eventDefinitionGroups;
        newTagLayerInfos[0].tagDefinitionGroups = action.payload.tagDefinitionGroups;
        newTagLayerInfos[0].tagRelation = action.payload.tagRelation;
      }else{
        action.payload = {};
      }
      return { ...state, allUserGroupData: action.payload, tagLayerInfos: newTagLayerInfos };
    },
    setModalType(state, action){
      return { ...state, modalType: action.payload };
    },
    setListDetailShow(state, action){
      return { ...state, listDetailShow: action.payload };
    },
    setCallSceneShow(state, action){
      return { ...state, callSceneShow: action.payload };
    },
    setComplateData(state, action){
      return { ...state, complateData: action.payload };
    },
    clearData(state, action){
      return { 
        ...state,
        allUserGroupData: {},
        allImportUserGroupData:{},
        tagLayerInfos:[],
        num:0,
        isCustomFlag:'',
      };
    },
  },
};
export default Model;
