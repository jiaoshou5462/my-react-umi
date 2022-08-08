import { saveCardPrize, seckillActivityRule, echoSeckillRuleActivity, onDeletePrice, deleteSeckill, updatePriceStock, queryMessageTemplate } from "@/services/activity";
const Model = {
  namespace: 'seckilActivityRules',
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
  },
  reducers: {
  },
};
export default Model;
