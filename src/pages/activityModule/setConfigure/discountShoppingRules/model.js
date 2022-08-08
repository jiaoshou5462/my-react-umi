import { 
  saveCardPrize, 
  seckillActivityRule, 
  echoSeckillRuleActivity, 
  onDeletePrice, 
  deleteSeckill, 
  updatePriceStock, 
  queryMessageTemplate,
  getBuyCheaperBuyLimit,
  getBuyCheaperCopyWriting,
  getBuyCheaperGoods,
  detBuyCheaperGoods,
  buyCheaperSaveRule,
  getCardByPackageNoNotGroupByCouponNum
 } from "@/services/activity";
const Model = {
  namespace: 'discountShoppingRules',
  state: {
  },
  effects: {
    //保存多张卡券组合成一个奖品
    *saveCardPrize ({ payload, callback }, { put, call }) {
      let response = yield call(saveCardPrize, payload);
      callback && callback(response)
    },
    //配置保存
    *seckillActivityRule ({ payload, callback }, { put, call }) {
      let response = yield call(seckillActivityRule, payload);
      callback && callback(response)
    },
    //配置回显
    *echoSeckillRuleActivity ({ payload, callback }, { put, call }) {
      let response = yield call(echoSeckillRuleActivity, payload);
      callback && callback(response)
    },
    //删除奖品
    *onDeletePrice ({ payload, callback }, { put, call }) {
      let response = yield call(onDeletePrice, payload);
      callback && callback(response)
    },
    //删除场次
    *deleteSeckill ({ payload, callback }, { put, call }) {
      let response = yield call(deleteSeckill, payload);
      callback && callback(response)
    },
    //获取卡券套餐详请
    *updatePriceStock ({ payload, callback }, { put, call }) {
      let response = yield call(updatePriceStock, payload);
      callback && callback(response)
    },
    //提醒模板
    *queryMessageTemplate ({ payload, callback }, { put, call }) {
      let response = yield call(queryMessageTemplate, payload);
      callback && callback(response)
    },
    //购买限制、循环周期查询
    *getBuyCheaperBuyLimit ({ payload, callback }, { put, call }) {
      let response = yield call(getBuyCheaperBuyLimit, payload);
      callback && callback(response)
    },
    //无库存文案查询
    *getBuyCheaperCopyWriting ({ payload, callback }, { put, call }) {
      let response = yield call(getBuyCheaperCopyWriting, payload);
      callback && callback(response)
    },
    //活动商品查询
    *getBuyCheaperGoods ({ payload, callback }, { put, call }) {
      let response = yield call(getBuyCheaperGoods, payload);
      callback && callback(response)
    },
    //活动商品删除
    *detBuyCheaperGoods ({ payload, callback }, { put, call }) {
      let response = yield call(detBuyCheaperGoods, payload);
      callback && callback(response)
    },
    //优惠购-活动形式和规则保存
    *buyCheaperSaveRule ({ payload, callback }, { put, call }) {
      let response = yield call(buyCheaperSaveRule, payload);
      callback && callback(response)
    },
    // 卡包明细
    *  getCardByPackageNoNotGroupByCouponNum ({ payload, callback }, { put, call }) {
      let response = yield call(  getCardByPackageNoNotGroupByCouponNum, payload);
      callback && callback(response)
    },
  },
  reducers: {
  },
};
export default Model;
