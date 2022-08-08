import {
  getStoreList,
  getConfigCode,
  getChannelList,
  getBranchList,
  getProviderList,
  getCarBrandList,
  getCarModelList,
  getUserProviderList,
} from '@/services/order'
import {message} from "antd";
const model = {
  namespace: 'orderPublic',
  //默认数据
  state: {
    providerList: [], // 服务商/供应商列表
    branchList: [], //分支机构列表
    reserveStoreList: [], // 预约门店列表
    reserveStoreTotal: 0, // 预约门店总数
    actualStoreList: [], // 实际门店列表
    actualStoreTotal: 0, // 实际门店总数
    provinceList: [], //省列表
    cityList: [], //市列表
    regionList: [], //区列表
    serviceTypeList: [], //服务类型列表
    serviceItemList: [], //服务项目列表
    channelList: [], //渠道列表
    underwritingList: [], //承保单位列表
    userProviderList: [], //救援模块 供应商列表
    positionList: [], //方位列表
    faultTypeList: [], //故障类型列表
    carTypeList: [], //车型列表
    carColorList: [], //车辆颜色列表
    insuranceList: [], //保险公司列表
    carBrandList: [], //车辆品牌列表
    carModelList: [], //车辆车系列表
  },
  //处理异步事件
  effects: {
    /*服务商/供应商列表*/
    *getProviderList({payload, callback},{call,put}){
      let response = yield call(getProviderList, payload)
      if(response.code === 'S000000') {
        yield put({
          type: "setProviderList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*分支机构*/
    *getBranchList({payload, callback},{call,put}){
      let response = yield call(getBranchList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setBranchList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*预约门店列表*/
    *getReserveStoreList({payload, callback},{call,put}){
      let response = yield call(getStoreList, payload)
      if(response.code === 'S000000') {
        yield put({
          type: "setReserveStoreList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*实际门店列表*/
    *getActualStoreList({payload, callback},{call,put}){
      let response = yield call(getStoreList, payload)
      if(response.code === 'S000000') {
        yield put({
          type: "setActualStoreList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*查询 服务类型、服务项目、方位、故障类型、车型、颜色、保险公司、省市区、承保单位 字典接口*/
    *getConfigCode({payload, flag, callback},{call,put}){
      let response = yield call(getConfigCode, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setConfigCode",
          payload: {
            flag,
            response
          }
        })
      }else {
        message.error(response.result.message)
      }
      callback && callback(response)
    },
    /*获取渠道列表*/
    *getChannelList({payload, callback},{call,put}){
      let response = yield call(getChannelList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setChannelList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*查询 救援模块 供应商列表*/
    *getUserProviderList({payload, callback},{call,put}){
      let response = yield call(getUserProviderList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setUserProviderList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取车辆品牌列表*/
    *getCarBrandList({payload, callback},{call,put}){
      let response = yield call(getCarBrandList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setCarBrandList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*获取车辆车系列表*/
    *getCarModelList({payload, callback},{call,put}){
      let response = yield call(getCarModelList, payload)
      if(response.result.code === '0') {
        yield put({
          type: "setCarModelList",
          payload: response
        })
      }else {
        message.error(response.result.message)
      }
    },
    /*重置*/
    *onReset({payload, flag, callback},{call,put}){
      yield put({
        type: "setReset",
        payload: {
          flag,
        }
      })
    },
  },
  //处理同步事件
  reducers: {
    setProviderList(state,{payload}){
      state.providerList =  payload.data
      return {...state};
    },
    setReserveStoreList(state,{payload}){
      state.reserveStoreList =  payload.data
      state.reserveStoreTotal =  payload.pageInfo.totalCount
      return {...state};
    },
    setActualStoreList(state,{payload}){
      state.actualStoreList =  payload.data
      state.actualStoreTotal =  payload.pageInfo.totalCount
      return {...state};
    },
    setConfigCode(state,{payload}){
      /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位
      7、方位 8、故障类型 9、车型 10.车辆颜色 11、保险公司*/
      let {flag} = payload
      let temp = payload.response.body || []
      if(flag === 1) {
        state.provinceList = temp;
      }
      if(flag === 2) {
        state.cityList = temp
      }
      if(flag === 3) {
        state.regionList = temp
      }
      if(flag === 4) {
        state.serviceTypeList = temp
      }
      if(flag === 5) {
        state.serviceItemList = temp
      }
      if(flag === 6) {
        state.underwritingList = temp
      }
      if(flag === 7) {
        state.positionList = temp
      }
      if(flag === 8) {
        state.faultTypeList = temp
      }
      if(flag === 9) {
        state.carTypeList = temp
      }
      if(flag === 10) {
        state.carColorList = temp
      }
      if(flag === 11) {
        state.insuranceList = temp
      }
      return {...state};
    },
    setReset(state, {payload}) {
      /*1、省 2、市 3、区 4、服务类型 5、服务项目 6、承保单位
    7、方位 8、故障类型 9、车型 10.车辆颜色 11、保险公司*/
      let {flag} = payload
      if(flag === 1){
        state.cityList = []
        state.regionList = []
      }
      if(flag === 2){
        state.cityList = []
      }
      if(flag === 3){
        state.regionList = []
      }
      if(flag === 5) {
        state.serviceItemList = []
      }
      return {...state};
    },
    setChannelList(state,{payload}){
      state.channelList =  payload.body.list
      return {...state};
    },
    setUserProviderList(state,{payload}){
      state.userProviderList =  payload.body
      return {...state};
    },
    setCarBrandList(state,{payload}){
      state.carBrandList =  payload.body
      return {...state};
    },
    setCarModelList(state,{payload}){
      state.carModelList =  payload.body
      return {...state};
    },
    setBranchList(state,{payload}){
      state.branchList =  payload.body
      return {...state};
    },
  },
  //发布订阅事件
  subscriptions: {},
};
export default model;
