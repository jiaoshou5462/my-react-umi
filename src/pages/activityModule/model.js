
// 活动配置通用model
import { queryThirdChannel } from "@/services/activity";
const activityModel = {
  namespace: 'activityModule',
  state: {
    ruleList: [],
  },
  effects: {
    //保存多张卡券组合成一个奖品
    *queryThirdChannel ({ payload, callback }, { put, call }) {
      let response = yield call(queryThirdChannel, payload);

      yield put({
        type: 'setRuleList',
        payload: response,
      });
      callback && callback(response)
    },
  },
  reducers: {
    setRuleList (state, action) {
      let list = [];
      if (action.payload.body && action.payload.body.length > 0) {
        action.payload.body.forEach(el => {
          let toEl = el;
          if (el.triggerId && el.triggerId > 3) {
            if (el.triggerId == 100) {
              toEl.actionName = "certificationCopywriting";
            } else if (el.triggerId == 101) {
              toEl.actionName = "thirdAttentionWechatCopywriting";
            } else if (el.triggerId == 102) {
              toEl.actionName = "thirdMemberRegisterCopywriting";
            } else if (el.triggerId == 103) {
              toEl.actionName = "thirdCertificationCopywriting";
            } else if (el.triggerId == 104) {
              toEl.actionName = "thirdBindCarCopywriting";
            } else if (el.triggerId == 105) {
              toEl.actionName = "otherCopywriting";
            }
            list.push(toEl)
          } else {
            list.push(el)
          }
        });
      }
      return { ...state, ruleList: list };
    },
  },
};
export default activityModel;
