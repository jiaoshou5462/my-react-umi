import {
  queryAllComponentList,
  queryPageComponentList,
  getPageList,
  saveComponent,
  deleteComponent,
  queryPageList,
  getAllChannel,
  updatePageName,
  addPage,
  delPage,
  publishPage,
  sortComponent,
  updatePageForHome,
  existHomeFlag,
  updEnableStatus,
  getAllGoodClass,
  getSupGoodsById,
  queryHotProduct,
  getPageSupGoodsPage,
  queryActivityByStatus,
} from "@/services/carowner";
import {crmNewsCategoryList,} from '@/services/team';
import {queryMarketTypeList} from "@/services/activity"
import {  history } from 'umi'
const model = {
  namespace: 'carowner_pageManage',
  //默认数据
  state: {
    pageList: [], //列表页数据
    pageTotal: 0, //列表页总数量
    allCompList: [],//全部可选组件数据
    pageAllList:[],//全部组件数据 不分置顶
    pageCompList: [],//搭建好的组件列表
    pageCompListComplete:false,//搭建好的组件列表-第一次请求完毕
    noSort:[],//不排序
    putItem: {}, //点击中间手机组件抛的值
    sendItem:{},//表单组件变动时，同步的值
    listSelect:[],//下拉数据
    allChannelList: [], //渠道列表
    listFormSave:{ //列表页参数缓存
      pageName:'',
      pageNo: 1,
    },
    settingAllData:{},//总体样式
    compSaveList:[],//全部样式保存
    pageItem:{},
    marketData:{
      tabList:[],
      goodsList:[],
    },
    checkSettingAll:true,//校验页面总体设置
  },

  //处理异步事件
  effects: {
    // 处理修改值
    *queryAllComponentList({ payload ,callback}, { call,put }) {
      let response = yield call(queryAllComponentList, payload);
      yield put({
        type: 'setAllComponentList',
        payload: response.data || [],
      });
    },
    *queryPageComponentList({ payload, callback}, { call,put }) {
      let response = yield call(queryPageComponentList, payload);
      yield put({
        type: 'setPageItem',
        payload: response.data ? {
          pageStatus: response.data.pageStatus,
          homeFlag: response.data.homeFlag,
          pageName: response.data.pageName || '',
          isDisplayName: response.data.isDisplayName,
          backgroundColor: response.data.backgroundColor || '#fff',
          pageNameUnique: response.data.pageNameUnique || '',
          pageDescribe: response.data.pageDescribe || '',
          shareTitle: response.data.shareTitle || '',
          shareDescribe: response.data.shareDescribe || '',
          shareImage: response.data.shareImage || '',
        }:{},
      });
      //处理模板数据
      let dataList = response.data ? response.data.list : [];
      let all=[];
      if(dataList && dataList.length){
        for(let item of dataList){
          let list = item.componentAttributes;
          let style = item.componentStyle;
          item.type = item.wechatH5ComponentVO.componentKey;
          item.compList = list && JSON.parse(list);
          item.compStyle = style && JSON.parse( JSON.parse(style)==='[{}]' ? JSON.parse(style) : style ) || [{}];
          item.componentName = item.wechatH5ComponentVO.componentName;
          all.push(item);
        }
      }
      callback && callback(all);
      yield put({
        type: 'setPageComponentList',
        payload: all,
      });
    },
    *getPageListData({ payload }, { call,put }) {
      let response = yield call(getPageList, payload);
      yield put({
        type: 'setPageList',
        payload: response,
      });
    },
    *saveComponentOne({ payload , callback}, { call,put }) {
      let response = yield call(saveComponent, payload);
      callback && callback(response)
    },
    *deleteComponentOne({ payload , callback}, { call,put }) {
      let response = yield call(deleteComponent, payload);
      callback && callback(response)
    },
    *queryPageListSelect({ payload}, { call,put }){
      let response = yield call(queryPageList, payload);
      yield put({
        type: 'setQueryPageList',
        payload: response.data,
      });
    },
    *getAllChannelData({ payload}, { call,put }){
      //saas端不需要展示其实渠道
      // let response = yield call(getAllChannel, payload);
      let tokenObj = JSON.parse(localStorage.getItem('tokenObj'));
      let list = [{
        channelId: tokenObj.channelId,
        channelName: tokenObj.channelName
      }]
      yield put({
        type: 'setAllChannel',
        payload: list,
      });
    },
    *updatePageNames({ payload , callback}, { call,put }) {
      let response = yield call(updatePageName, payload);
      callback && callback(response)
    },
    *addPageData({ payload , callback}, { call,put }) {
      let response = yield call(addPage, payload);
      callback && callback(response)
    },
    *delPageData({ payload , callback}, { call,put }) {
      let response = yield call(delPage, payload);
      callback && callback(response)
    },
    *publishPageData({ payload , callback}, { call,put }) {
      let response = yield call(publishPage, payload);
      callback && callback(response)
    },
    *sortComponentData({ payload , callback}, { call,put }) {
      let response = yield call(sortComponent, payload);
      callback && callback(response)
    },
    //设为主页
    *updatePageForHome({ payload , callback}, { call,put }) {
      let response = yield call(updatePageForHome, payload);
      callback && callback(response)
    },
    //判断是否已有主页
    *existHomeFlag({ payload , callback}, { call,put }) {
      let response = yield call(existHomeFlag, payload);
      callback && callback(response)
    },
    *updEnableStatus({ payload , callback}, { call,put }) {
      let response = yield call(updEnableStatus, payload);
      callback && callback(response)
    },
    //保险超市 获取分类
    *getAllGoodClass({ payload , callback}, { call,put }) {
      let response = yield call(getAllGoodClass, payload);
      callback && callback(response)
    },
    //保险超市 获取商品数据
    *getSupGoodsById({ payload , callback}, { call,put }) {
      let response = yield call(getSupGoodsById, payload);
      callback && callback(response)
    },
    //资讯内容
    *queryHotProduct({ payload , callback}, { call,put }) {
      let response = yield call(queryHotProduct, payload);
      callback && callback(response)
    },
    //热销产品
    *getPageSupGoodsPage({ payload , callback}, { call,put }) {
      let response = yield call(getPageSupGoodsPage, payload);
      callback && callback(response)
    },
    //活动投放
    *queryActivityByStatus({ payload , callback}, { call,put }) {
      let response = yield call(queryActivityByStatus, payload);
      callback && callback(response)
    },
    *crmNewsCategoryList({ payload , callback}, { call,put }) {
      let response = yield call(crmNewsCategoryList, payload);
      callback && callback(response)
    },
    *queryMarketTypeList({ payload , callback}, { call,put }) {
      let response = yield call(queryMarketTypeList, payload);
      callback && callback(response)
    },
  },
  //处理同步事件
  reducers: {
    // 修改数据
    setAllComponentList(state, action ) {
      return { ...state, allCompList: action.payload };
    },
    setPageComponentList(state, action) {
      let noSort = [];
      let yesSort = [];
      for(let item of action.payload){
        if(item.type=='userInfo'){
          noSort.unshift(item);
        } else if(item.defaultComponent==1){//置顶
          noSort.push(item);
        } else {
          yesSort.push(item);
        }
      }
      return { ...state, pageCompList: yesSort,noSort:noSort,pageAllList: action.payload,
        pageCompListComplete:true,
      };
    },
    setQueryPageList(state, action){
      //过滤掉当前页面，不允许重复嵌套
      let pageId = history.location.query.pageId;
      let list = action.payload.filter((item)=>{
        return pageId != item.objectId
      })
      return { ...state ,listSelect: list};
    },
    setPutItem(state, action) {
      return { ...state, putItem: action.payload};
    },
    setSendItem(state, action) {
      return { ...state, sendItem: action.payload};
    },
    setPageList(state, action) {
      return { ...state, pageList: action.payload.data, pageTotal: action.payload.pageInfo.totalCount};
    },
    setAllChannel(state, action) {
      return { ...state, allChannelList: action.payload};
    },
    setListFormSave(state, action) {
      return { ...state, listFormSave: action.payload};
    },
    settingAll(state, action) {
      return { ...state, settingAllData: action.payload};
    },
    setCompSaveList(state, action) {
      return { ...state, compSaveList: action.payload};
    },
    setPageItem(state, action) {
      return { ...state, pageItem: action.payload};
    },
    setMarketData(state, action) {
      return { ...state, marketData: action.payload};
    },
    clearDetail(state, action) {
      return { ...state,
        pageCompList: [],
        noSort:[],
        pageAllList:[],
        putItem:{},
        sendItem:{},
        pageItem:{},
        pageCompListComplete:false,
      };
    },
    setCheckSettingAll(state, action) {
      return { ...state, checkSettingAll: action.payload};
    },
  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;