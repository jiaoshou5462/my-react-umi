import { saveCrmTaskDetailInfo, queryTaskDetailInfo } from '@/services/saleTask';
const Model = {
  namespace: 'saleTaskreward',
  state: {
    taskDetailInfo: {}, // 详情对象
  },
  effects: {
    // 销售任务 保存-修改任务详情信息(设置任务kpi与奖励)
    *saveCrmTaskDetailInfo({ payload, callback }, { call, put }) {
      let response = yield call(saveCrmTaskDetailInfo, payload);
      callback && callback(response)
    },
    // 销售任务  第二部查询
    *getTaskDetailInfo({ payload, callback }, { call, put }) {
      let response = yield call(queryTaskDetailInfo, payload);
      callback && callback(response)
    },
  },
  reducers: {

  },
};
export default Model;