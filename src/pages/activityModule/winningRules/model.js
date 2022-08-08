import {
  saveThrong,
  getThrongList,
  savePrizeInfo,
  onDeletePrice,
  getPrizeDetail,
  onDeleteThrong,
  getThrongDetail,
  updatePriceStock,
  saveCardPrize
} from "@/services/activity";

const winningRules = {
  namespace: 'winningRules',
  state: {
  },
  effects: {
    //获取人群列表
    *getCrowdList({ payload, callback }, { put,call }){
      let response = yield call(getThrongList, payload);
      callback && callback(response)
    },
    //保存奖品接口
    *savePrizeInfo({ payload, callback }, { put,call }){
      let response = yield call(savePrizeInfo, payload);
      callback && callback(response)
    },
    //保存人群
    *saveThrong({ payload, callback }, { put,call }){
      let response = yield call(saveThrong, payload);
      callback && callback(response)
    },
    //获取已保存人群详请
    *getThrongDetail({ payload, callback }, { put,call }){
      let response = yield call(getThrongDetail, payload);
      callback && callback(response)
    },
    //获取已保存奖品详请
    *getPrizeDetail({ payload, callback }, { put,call }){
      let response = yield call(getPrizeDetail, payload);
      callback && callback(response)
    },
    //获取卡券套餐详请
    *updatePriceStock({ payload, callback }, { put,call }){
      let response = yield call(updatePriceStock, payload);
      callback && callback(response)
    },
    //删除奖品
    *onDeletePrice({ payload, callback }, { put,call }){
      let response = yield call(onDeletePrice, payload);
      callback && callback(response)
    },
    //删除人群
    *onDeleteThrong({ payload, callback }, { put,call }){
      let response = yield call(onDeleteThrong, payload);
      callback && callback(response)
    },
    //保存多张卡券组合成一个奖品
    *saveCardPrize({ payload, callback }, { put,call }){
      let response = yield call(saveCardPrize, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default winningRules;
