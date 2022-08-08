import { message } from "antd";
import { connect, history } from 'umi'
import { BlockOutlined } from "@ant-design/icons";
import {
  getAllChannel,
  category,
  complateQuato,
  listGrantBatch,
  queryUseCount,
  delGrantBatch,
  queryGrantDetail,
  importNameList,
  download,
  withdraw,
  listGrantBatchDetail,
  addGrantBatch,
  uploadSingle,
  checkExcelData,
  selectChannelSku,
  selectChannelCoupon,
  listMarketProject,
  selectChannelCouponPackage,
  queryPackage,
  queryCardByPackageNo,
  queryCardByPackageNoNotGroupByCouponNum,
  startEffect,
  startInfo,
  verifyCode,
  verifyCodeFilePass,
  confirmWithdraw,
  grantCopy,
  grantDelete,
  grantInvalid
} from "@/services/cardgrant";
const model = {
  namespace: 'cardgrantManageModel',
  //默认数据
  state: {
    isRadioTabs: 1,//Tabs切换，默认值,列表页
    isCardRadioTabs: 0,//Tabs切换，默认值,0:卡券，1：卡包,2兑换码
    channelList: [],//渠道下拉
    categoryList: [],//品类下拉
    moneyQuato: {},//额度
    grantData: {},//列表数据
    queryRecord: {},//发放记录
    totalCount: 0,//列表总数
    grantDetailObj: {},//详情子数据，{},
    skuList: [],//SKU下拉
    couponList: [],//卡券列表
    couponTotal: 0,//基础总数
    selsctMarketingItems: [],//营销活动下拉
    couponCardbagList: [],//卡包列表
    couponCardbagTotal: 0,//卡包总数
    cardbagIdList: [],//卡包ID下拉
    cardbagDetailList: [],//卡包详情
    cardbagByCouponNumList: [],//卡包明细
    compData: {
      detailList: [],
      packageAddResult: {}//（卡包投放时传）
    },
    allObj: {
      allCont: 0,
      allMoney: 0,
    },
    editInfo: {},//编辑反显信息
    effectDetailList: [],//生效弹框的列表
    verifyCodeData: {},//查看兑换码信息
    codeFilePassData: {},//查看兑换码密码信息
  },

  //处理异步事件
  effects: {
    // 处理修改值

    //渠道查询
    *selectChannel({ payload }, { call, put }) {
      let response = yield call(getAllChannel, payload);
      yield put({
        type: "setChannel",
        payload: response
      })
    },
    // 品类数据
    *categorySelect({ payload }, { call, put }) {
      let response = yield call(category, payload);
      yield put({
        type: "setCategorySelect",
        payload: response.body
      })
    },
    // 额度
    *compQuato({ payload }, { call, put }) {
      let response = yield call(complateQuato, payload)
      yield put({
        type: 'setcompQuato',
        payload: response.body
      })
    },
    //列表
    *listGrant({ payload }, { call, put }) {
      let response = yield call(listGrantBatch, payload)
      yield put({
        type: 'setListGrant',
        payload: response.body
      })
    },
    *useCount({ payload, callback }, { call, put }) {
      let response = yield call(queryUseCount, payload)
      yield put({
        type: 'setUseCount',
        payload: response.body
      })
      callback && callback(response)
    },
    // 发放记录
    *queryGrantRecord({ payload, callback }, { call, put }) {
      let response = yield call(queryGrantDetail, payload)
      yield put({
        type: 'setQueryGrantRecord',
        payload: response.body
      })
      callback && callback(response)
    },
    // 发放记录-->导出名单
    *nameListExcel({ payload, callback }, { call, put }) {
      let response = yield call(importNameList, payload)
      // yield put({
      //   type: 'setNameListExcel',
      //   payload: response.body
      // })
      callback && callback(response)
    },
    //文件下载
    *fileDownload({ payload, callback }, { call, put }) {
      let response = yield call(download, payload)
      // yield put({
      //   type: 'setNameListExcel',
      //   payload: response.body
      // })
      callback && callback(response)
    },

    // 撤回发放
    *toWithdraw({ payload, callback }, { call, put }) {
      let response = yield call(withdraw, payload)
      yield put({
        type: 'setToWithdraw',
        payload: response.body
      })
      callback && callback(response)
    },

    //卡券投放展开子列表
    *detailGrant({ payload }, { call, put }) {
      let response = yield call(listGrantBatchDetail, payload)
      yield put({
        type: 'setDetailGrant',
        payload: response.body
      })
    },

    //新增(保存)
    *addGrant({ payload, callback }, { call, put }) {
      let response = yield call(addGrantBatch, payload)
      yield put({
        type: 'setAddGrant',
        payload: response.body
      })
      callback && callback(response)
    },
    //上传名单
    *uploadNameList({ payload, callback }, { call, put }) {
      let response = yield call(uploadSingle, payload)
      yield put({
        type: 'setUploadNameList',
        payload: response
      })
      callback && callback(response)
    },
    // 上传名单之后的数据
    *backExcelData({ payload, callback }, { call, put }) {
      let response = yield call(checkExcelData, payload)
      yield put({
        type: 'setBackExcelData',
        payload: response.body
      })
      callback && callback(response)
    },
    // SKU下拉
    *channelSku({ payload }, { call, put }) {
      let response = yield call(selectChannelSku, payload)
      yield put({
        type: 'setChannelSku',
        payload: response.body
      })
    },

    // 基础卡券
    *channelCoupon({ payload }, { call, put }) {
      let response = yield call(selectChannelCoupon, payload)
      yield put({
        type: 'setChannelCoupon',
        payload: response.body
      })
    },

    //查询全部营销活动
    *selsctAllMarketing({ payload }, { call, put }) {
      let response = yield call(listMarketProject, payload);
      yield put({
        type: "setSelsctAllMarketing",
        payload: response.body
      })
    },

    // 基础卡包
    *channelCouponPackage({ payload }, { call, put }) {
      let response = yield call(selectChannelCouponPackage, payload)
      yield put({
        type: 'setChannelCouponPackage',
        payload: response.body
      })
    },

    // 基础卡包-卡包ID下拉框数据
    *selsctQueryPackage({ payload }, { call, put }) {
      let response = yield call(queryPackage, payload)
      yield put({
        type: 'setSelsctQueryPackage',
        payload: response.body
      })
    },

    // 卡包详情
    *detailCardByPackageNo({ payload, callback }, { call, put }) {
      let response = yield call(queryCardByPackageNo, payload)
      yield put({
        type: 'setDetailCardByPackageNo',
        payload: response.body
      })
      callback && callback(response)
    },
    // 卡包明细
    *detailCardByCouponNum({ payload }, { call, put }) {
      let response = yield call(queryCardByPackageNoNotGroupByCouponNum, payload)
      yield put({
        type: 'setDetailCardByCouponNum',
        payload: response.body
      })
    },
    // 批次生效
    *getStartEffect({ payload, callback }, { call, put }) {
      let response = yield call(startEffect, payload)
      yield put({
        type: 'setStartEffect',
        payload: response.body
      })
      callback && callback(response)
    },
    // 批次信息
    *getStartInfo({ payload, callback }, { call, put }) {
      let response = yield call(startInfo, payload)
      yield put({
        type: 'setStartInfo',
        payload: response.body
      })
      callback && callback(response)
    },

    // 查看兑换码
    *getVerifyCode({ payload, callback }, { call, put }) {
      let response = yield call(verifyCode, payload)
      yield put({
        type: 'setVerifyCode',
        payload: response.body
      })
      // callback && callback(response)
    },
    // 查看兑换码文件密码信息
    *getVerifyCodeFilePass({ payload, callback }, { call, put }) {
      let response = yield call(verifyCodeFilePass, payload)
      yield put({
        type: 'setVerifyCodeFilePass',
        payload: response.body
      })
      // callback && callback(response)
    },
    // 撤回文案
    *getConfirmWithdraw({ payload, callback }, { call, put }) {
      let response = yield call(confirmWithdraw, payload)
      yield put({
        type: 'setConfirmWithdraw',
        payload: response.body
      })
      callback && callback(response)
    },

    // 复制批次
    *getGrantCopy({ payload, callback }, { call, put }) {
      let response = yield call(grantCopy, payload)
      yield put({
        type: 'setGrantCopy',
        payload: response.body
      })
      callback && callback(response)
    },
    // 删除
    *getGrantDelete({ payload, callback }, { call, put }) {
      let response = yield call(grantDelete, payload)
      yield put({
        type: 'setGrantDelete',
        payload: response.body
      })
      callback && callback(response)
    },
    // 失效
    *getGrantInvalid({ payload, callback }, { call, put }) {
      let response = yield call(grantInvalid, payload)
      yield put({
        type: 'setGrantInvalid',
        payload: response.body
      })
      callback && callback(response)
    },

  },





  //处理同步事件
  reducers: {
    // 修改数据
    setRadioTabs(state, action) {
      return { ...state, isRadioTabs: action.payload };
    },
    setCardRadioTabs(state, action) {
      return { ...state, isCardRadioTabs: action.payload };
    },
    //1设置渠道数据
    setChannel(state, action) {
      // console.log(action, '渠道')
      return { ...state, channelList: action.payload.data };
    },
    setCategorySelect(state, action) {
      // console.log(action, '品类')
      return {
        ...state,
        categoryList: action.payload.list
      };
    },
    setcompQuato(state, action) {
      // console.log(action, '额度')
      return { ...state, moneyQuato: action.payload };
    },
    setListGrant(state, action) {
      // console.log(action, '列表')
      return {
        ...state,
        grantData: action.payload,
      };
    },
    setUseCount(state, action) {
      // console.log(action, '查看使用人数')
      return { ...state };
    },
    setQueryGrantRecord(state, action) {
      // console.log(action, '发放记录')
      return { ...state, queryRecord: action.payload };
    },
    // setNameListExcel(state, action) {
    //   console.log(action, '导出名单')
    //   return { ...state, };
    // },

    setToWithdraw(state, action) {
      // console.log(action, '撤回')
      return { ...state, };
    },

    setDetailGrant(state, action) {
      // console.log(action, '子列表')
      // : action.payload 
      return { ...state, grantDetailObj: action.payload };
    },
    setAddGrant(state, action) {
      // console.log(action, '新增')
      return {
        ...state,
      };
    },
    setUploadNameList(state, action) {
      // console.log(action, '上传')
      return {
        ...state,
      };
    },
    setBackExcelData(state, action) {
      // console.log(action, '上传返回的数据')
      return {
        ...state,
      };
    },
    setChannelSku(state, action) {
      // console.log(action, 'SKU')
      return {
        ...state,
        skuList: action.payload
      };
    },
    setChannelCoupon(state, action) {
      // console.log(action, '基础卡券')
      return {
        ...state,
        couponList: action.payload.list,
        couponTotal: action.payload.total
      };
    },
    setSelsctAllMarketing(state, action) {
      return {
        ...state,
        selsctMarketingItems: action.payload
      };
    },
    setChannelCouponPackage(state, action) {
      console.log(action, '基础卡包')
      return {
        ...state,
        couponCardbagList: action.payload.list,
        couponCardbagTotal: action.payload.total
      };
    },

    setSelsctQueryPackage(state, action) {
      console.log(action, '基础卡包-卡包ID下拉框数据')
      return {
        ...state,
        cardbagIdList: action.payload,
      };
    },

    setDetailCardByPackageNo(state, action) {
      console.log(action, '卡包详情');
      let cardbagDetailList = action.payload;
      // 将数据里面n条*每条对象展示
      // let listArr = [];
      // cardbagDetailList.map((item) => {
      //   for (var i = 0; i < item.couponNum; i++) {
      //     listArr.push(item)
      //   }
      // })
      // console.log(listArr, 'listArr')



      return {
        ...state,
        cardbagDetailList: cardbagDetailList,
      };
    },
    setDetailCardByCouponNum(state, action) {
      console.log(action, '卡包明细');
      let cardbagByCouponNumList = action.payload;
      // 将数据里面n条*每条对象展示
      // let listArr = [];
      // cardbagDetailList.map((item) => {
      //   for (var i = 0; i < item.couponNum; i++) {
      //     listArr.push(item)
      //   }
      // })
      // console.log(listArr, 'listArr')



      return {
        ...state,
        cardbagByCouponNumList: cardbagByCouponNumList,
      };
    },

    setCompData(state, action) {
      return {
        ...state,
        compData: action.payload,
      };
    },
    setAllObj(state, action) {
      return {
        ...state,
        allObj: action.payload,
      };
    },
    setStartEffect(state, action) {
      // console.log(action.payload, '6767')
      return {
        ...state,
        // allObj: action.payload,
      };
    },
    setStartInfo(state, action) {
      return {
        ...state,
        editInfo: action.payload,
        effectDetailList: action.payload.detailList
      };
    },
    setVerifyCode(state, action) {
      // console.log(action,'action')
      return {
        ...state,
        verifyCodeData: action.payload
      };
    },
    setVerifyCodeFilePass(state, action) {
      // console.log(action, 'action444 ')
      return {
        ...state,
        codeFilePassData: action.payload
      };
    },
    setConfirmWithdraw(state, action) {
      // console.log(action, 'action1111')
      return {
        ...state,
      };
    },
    setGrantCopy(state, action) {
      return {
        ...state,
      };
    },
    setGrantDelete(state, action) {
      return {
        ...state,
      };
    },
    setGrantInvalid(state, action) {
      return {
        ...state,
      };
    },
  },



  //发布订阅事件
  subscriptions: {

  },
};
export default model;